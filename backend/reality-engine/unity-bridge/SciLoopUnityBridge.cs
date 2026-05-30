using System;
using System.Collections.Generic;
using UnityEngine;

public class SciLoopUnityBridge : MonoBehaviour
{
    [Header("Scene Objects")]
    [SerializeField] private GameObject agentPrefab;
    [SerializeField] private GameObject fieldPrefab;
    [SerializeField] private Transform simulationRoot;

    [Header("Runtime")]
    [SerializeField] private float spawnRadius = 5f;
    [SerializeField] private float reportIntervalSeconds = 0.5f;
    [SerializeField] private bool reportToBrowser = true;

    [Serializable]
    public class SimulationCommand
    {
        public string simulationType = "ecosystem-dynamics";
        public EntityDefinition[] entities = Array.Empty<EntityDefinition>();
        public SimulationVariables variables = new SimulationVariables();
        public CausalRelation[] causalRelations = Array.Empty<CausalRelation>();
        public VisualModel visualModel = new VisualModel();
        public SimulationVariables controls = new SimulationVariables();
        public ResultsRequest resultsRequest = new ResultsRequest();
        public BridgeMeta bridgeMeta = new BridgeMeta();
    }

    [Serializable]
    public class EntityDefinition
    {
        public string id = "";
        public string type = "sphere-agent";
        public int count = 1;
        public string behavior = "";
        public string role = "";
        public float intensity = 1f;
        public float value = 0f;
    }

    [Serializable]
    public class SimulationVariables
    {
        public float gravity = 9.8f;
        public float speed = 1.2f;
        public int population = 34;
        public float energy = 62f;
        public float temperature = 24f;
    }

    [Serializable]
    public class CausalRelation
    {
        public string from = "";
        public string to = "";
        public string relation = "";
    }

    [Serializable]
    public class VisualModel
    {
        public string renderer = "";
        public string scene = "";
        public string camera = "";
        public string[] palette = Array.Empty<string>();
        public string[] effects = Array.Empty<string>();
    }

    [Serializable]
    public class ResultsRequest
    {
        public bool objectCount = true;
        public bool averageSpeed = true;
        public bool collisionCount = true;
        public bool stabilityScore = true;
    }

    [Serializable]
    public class BridgeMeta
    {
        public string protocol = "";
        public string version = "";
        public string targetObject = "";
        public string targetMethod = "";
        public string generatedAt = "";
    }

    [Serializable]
    public class SimulationResults
    {
        public int objectCount;
        public float averageSpeed;
        public int collisionCount;
        public float stabilityScore;
    }

    private readonly List<Rigidbody> activeBodies = new List<Rigidbody>();
    private readonly List<GameObject> spawnedObjects = new List<GameObject>();
    private SimulationVariables currentVariables = new SimulationVariables();
    private float nextReportTime;
    private int collisionCount;

    public void LoadSimulation(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            Debug.LogWarning("[SciLoop Unity Bridge] Empty simulation JSON received.");
            return;
        }

        SimulationCommand command;
        try
        {
            command = JsonUtility.FromJson<SimulationCommand>(json);
        }
        catch (Exception error)
        {
            Debug.LogError("[SciLoop Unity Bridge] Failed to parse simulation JSON: " + error.Message);
            return;
        }

        if (command == null)
        {
            Debug.LogWarning("[SciLoop Unity Bridge] Parsed command was null.");
            return;
        }

        ApplyCommand(command);
    }

    public void UpdateGravity(float value)
    {
        currentVariables.gravity = Mathf.Max(0f, value);
        Physics.gravity = new Vector3(0f, -currentVariables.gravity, 0f);
    }

    public void UpdateSpeed(float value)
    {
        currentVariables.speed = Mathf.Clamp(value, 0.05f, 12f);
    }

    public void UpdatePopulation(int value)
    {
        currentVariables.population = Mathf.Clamp(value, 1, 250);
        ReconcilePopulation(currentVariables.population);
    }

    public void UpdateTemperature(float value)
    {
        currentVariables.temperature = Mathf.Clamp(value, -100f, 160f);
    }

    public void UpdateEnergy(float value)
    {
        currentVariables.energy = Mathf.Clamp(value, 0f, 100f);
    }

    private void ApplyCommand(SimulationCommand command)
    {
        var variables = command.variables ?? command.controls ?? new SimulationVariables();
        currentVariables = variables;
        UpdateGravity(variables.gravity);
        UpdateSpeed(variables.speed);
        UpdateEnergy(variables.energy);
        UpdateTemperature(variables.temperature);
        ResetSceneRoot();
        SpawnField(command);
        ReconcilePopulation(Mathf.Clamp(variables.population, 1, 250));
        SendResultsToBrowser();
    }

    private void ResetSceneRoot()
    {
        if (simulationRoot == null)
        {
            var root = new GameObject("SciLoopUnitySimulationRoot");
            simulationRoot = root.transform;
        }

        foreach (var spawned in spawnedObjects)
        {
            if (spawned != null)
            {
                Destroy(spawned);
            }
        }

        spawnedObjects.Clear();
        activeBodies.Clear();
        collisionCount = 0;
    }

    private void SpawnField(SimulationCommand command)
    {
        GameObject field = fieldPrefab != null
            ? Instantiate(fieldPrefab, simulationRoot)
            : GameObject.CreatePrimitive(PrimitiveType.Cylinder);

        field.name = "SciLoop Energy Field";
        field.transform.SetParent(simulationRoot, false);
        field.transform.position = new Vector3(0f, -0.08f, 0f);
        field.transform.localScale = new Vector3(8f, 0.05f, 8f);
        ApplyColor(field, ColorFromTemperature(currentVariables.temperature, currentVariables.energy), 0.48f);
        spawnedObjects.Add(field);
    }

    private void ReconcilePopulation(int desiredCount)
    {
        while (activeBodies.Count < desiredCount)
        {
            SpawnAgent(activeBodies.Count);
        }

        while (activeBodies.Count > desiredCount)
        {
            var lastIndex = activeBodies.Count - 1;
            var body = activeBodies[lastIndex];
            activeBodies.RemoveAt(lastIndex);

            if (body != null)
            {
                spawnedObjects.Remove(body.gameObject);
                Destroy(body.gameObject);
            }
        }
    }

    private void SpawnAgent(int index)
    {
        GameObject agent = agentPrefab != null
            ? Instantiate(agentPrefab, simulationRoot)
            : GameObject.CreatePrimitive(PrimitiveType.Sphere);

        agent.name = "SciLoop Agent " + index;
        agent.transform.SetParent(simulationRoot, false);
        var angle = index * 137.5f * Mathf.Deg2Rad;
        var radius = Mathf.Sqrt(index + 1f) / Mathf.Sqrt(Mathf.Max(1, currentVariables.population)) * spawnRadius;
        agent.transform.position = new Vector3(Mathf.Cos(angle) * radius, 1f + (index % 5) * 0.18f, Mathf.Sin(angle) * radius);
        agent.transform.localScale = Vector3.one * Mathf.Lerp(0.18f, 0.46f, Mathf.Clamp01(currentVariables.energy / 100f));
        ApplyColor(agent, Color.Lerp(new Color(0.35f, 0.92f, 1f), new Color(1f, 0.82f, 0.32f), Mathf.Clamp01(currentVariables.energy / 100f)), 0.86f);

        var body = agent.GetComponent<Rigidbody>();
        if (body == null)
        {
            body = agent.AddComponent<Rigidbody>();
        }

        body.mass = Mathf.Lerp(0.6f, 1.8f, Mathf.Clamp01(currentVariables.gravity / 20f));
        body.drag = 0.2f;
        body.angularDrag = 0.35f;
        body.AddForce(UnityEngine.Random.insideUnitSphere * currentVariables.speed * 2.4f, ForceMode.VelocityChange);

        var relay = agent.GetComponent<SciLoopCollisionRelay>();
        if (relay == null)
        {
            relay = agent.AddComponent<SciLoopCollisionRelay>();
        }
        relay.Owner = this;

        activeBodies.Add(body);
        spawnedObjects.Add(agent);
    }

    private void Update()
    {
        DriveAgents();

        if (Time.time >= nextReportTime)
        {
            nextReportTime = Time.time + Mathf.Max(0.1f, reportIntervalSeconds);
            SendResultsToBrowser();
        }
    }

    private void DriveAgents()
    {
        var energyFactor = Mathf.Clamp01(currentVariables.energy / 100f);
        var temperatureStress = Mathf.Clamp01(Mathf.Abs(currentVariables.temperature - 24f) / 80f);
        var impulse = currentVariables.speed * Mathf.Lerp(0.4f, 1.2f, energyFactor) * Time.deltaTime;

        foreach (var body in activeBodies)
        {
            if (body == null) continue;
            var centerPull = -body.transform.position;
            centerPull.y = 0f;
            body.AddForce(centerPull.normalized * impulse * 0.32f, ForceMode.Acceleration);
            body.AddForce(UnityEngine.Random.insideUnitSphere * impulse * (1f + temperatureStress), ForceMode.Acceleration);
        }
    }

    public void RegisterCollision()
    {
        collisionCount += 1;
    }

    private SimulationResults CalculateResults()
    {
        var totalSpeed = 0f;
        var count = 0;
        foreach (var body in activeBodies)
        {
            if (body == null) continue;
            totalSpeed += body.velocity.magnitude;
            count += 1;
        }

        var temperatureStress = Mathf.Clamp01(Mathf.Abs(currentVariables.temperature - 24f) / 80f);
        var crowdStress = Mathf.Clamp01(Mathf.Max(0, currentVariables.population - 45) / 95f);
        var energyBoost = Mathf.Clamp01(currentVariables.energy / 100f) * 0.12f;
        var stability = Mathf.Clamp01(0.92f - temperatureStress * 0.5f - crowdStress * 0.28f + energyBoost);

        return new SimulationResults
        {
            objectCount = count,
            averageSpeed = count > 0 ? totalSpeed / count : 0f,
            collisionCount = collisionCount,
            stabilityScore = stability
        };
    }

    private void SendResultsToBrowser()
    {
        var results = CalculateResults();
        var json = JsonUtility.ToJson(results);
        Debug.Log("[SciLoop Unity Bridge] Results: " + json);

        if (!reportToBrowser) return;

#if UNITY_WEBGL && !UNITY_EDITOR
        Application.ExternalCall("receiveSciLoopUnityResults", json);
#endif
    }

    private void ApplyColor(GameObject target, Color color, float alpha)
    {
        var renderer = target.GetComponent<Renderer>();
        if (renderer == null) return;

        var material = new Material(Shader.Find("Standard"));
        material.color = new Color(color.r, color.g, color.b, alpha);
        material.EnableKeyword("_EMISSION");
        material.SetColor("_EmissionColor", color * 0.55f);
        renderer.material = material;
    }

    private Color ColorFromTemperature(float temperature, float energy)
    {
        var hot = new Color(1f, 0.34f, 0.34f);
        var cool = new Color(0.35f, 0.86f, 1f);
        var warm = new Color(1f, 0.82f, 0.35f);
        var tempMix = Mathf.InverseLerp(-20f, 80f, temperature);
        var color = Color.Lerp(cool, hot, tempMix);
        return Color.Lerp(color, warm, Mathf.Clamp01(energy / 140f));
    }
}

public class SciLoopCollisionRelay : MonoBehaviour
{
    public SciLoopUnityBridge Owner { get; set; }

    private void OnCollisionEnter(Collision collision)
    {
        Owner?.RegisterCollision();
    }
}
