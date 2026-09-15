using System;
using System.Collections.Generic;
using UnityEngine;

public class SciLoopUnityBridge : MonoBehaviour
{
    [Header("Prefabs")]
    [SerializeField] private GameObject agentPrefab;
    [SerializeField] private GameObject energyParticlePrefab;
    [SerializeField] private GameObject fieldPrefab;
    [SerializeField] private Transform simulationRoot;

    [Header("Runtime")]
    [SerializeField] private float spawnRadius = 6f;
    [SerializeField] private float reportIntervalSeconds = 0.5f;
    [SerializeField] private bool reportToBrowser = true;

    [Serializable]
    public class SimulationCommand
    {
        public string source = "SciLoop";
        public string target = "Unity";
        public string version = "1.0";
        public string simulationType = "ecosystem";
        public EntityDefinition[] entities = Array.Empty<EntityDefinition>();
        public SimulationVariables variables = new SimulationVariables();
        public SimulationVariables controls = new SimulationVariables();
        public ResultsRequest resultsRequest = new ResultsRequest();
    }

    [Serializable]
    public class EntityDefinition
    {
        public string id = "";
        public string type = "";
        public string name = "";
        public int count = 1;
        public float energy = 62f;
        public float speed = 1.2f;
        public float energyValue = 25f;
        public string[] behavior = Array.Empty<string>();
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
    public class ResultsRequest
    {
        public bool aliveAgents = true;
        public bool averageEnergy = true;
        public bool collisionCount = true;
        public bool stabilityScore = true;
    }

    [Serializable]
    public class SimulationResults
    {
        public int aliveAgents;
        public float averageEnergy;
        public int collisionCount;
        public float stabilityScore;
    }

    private readonly List<AgentAI> activeAgents = new List<AgentAI>();
    private readonly List<EnergyParticle> activeResources = new List<EnergyParticle>();
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

    public void ResetSimulation()
    {
        ResetSceneRoot();
        SendResultsToBrowser();
    }

    public void UpdateGravity(float value)
    {
        currentVariables.gravity = Mathf.Max(0f, value);
        Physics.gravity = new Vector3(0f, -currentVariables.gravity, 0f);
    }

    public void UpdateSpeed(float value)
    {
        currentVariables.speed = Mathf.Clamp(value, 0.05f, 12f);
        foreach (var agent in activeAgents)
        {
            if (agent != null) agent.SetSpeed(currentVariables.speed);
        }
    }

    public void UpdatePopulation(int value)
    {
        currentVariables.population = Mathf.Clamp(value, 1, 250);
        ReconcileAgents(currentVariables.population);
    }

    public void UpdateEnergy(float value)
    {
        currentVariables.energy = Mathf.Clamp(value, 0f, 100f);
        foreach (var agent in activeAgents)
        {
            if (agent != null) agent.SetStartingEnergy(currentVariables.energy);
        }
    }

    public void UpdateTemperature(float value)
    {
        currentVariables.temperature = Mathf.Clamp(value, -100f, 160f);
    }

    public void RegisterCollision()
    {
        collisionCount += 1;
    }

    private void ApplyCommand(SimulationCommand command)
    {
        currentVariables = command.variables ?? command.controls ?? new SimulationVariables();
        UpdateGravity(currentVariables.gravity);
        ResetSceneRoot();
        SpawnField();
        ReconcileAgents(Mathf.Clamp(currentVariables.population, 1, 250));
        SpawnResources(Mathf.Max(4, Mathf.RoundToInt(currentVariables.population / 4f)), Mathf.Max(8f, currentVariables.energy / 3f));
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
            if (spawned != null) Destroy(spawned);
        }

        spawnedObjects.Clear();
        activeAgents.Clear();
        activeResources.Clear();
        collisionCount = 0;
    }

    private void SpawnField()
    {
        GameObject field = fieldPrefab != null
            ? Instantiate(fieldPrefab, simulationRoot)
            : GameObject.CreatePrimitive(PrimitiveType.Cylinder);

        field.name = "SciLoop AI Sandbox Field";
        field.transform.SetParent(simulationRoot, false);
        field.transform.position = new Vector3(0f, -0.08f, 0f);
        field.transform.localScale = new Vector3(9f, 0.05f, 9f);
        ApplyColor(field, ColorFromTemperature(currentVariables.temperature, currentVariables.energy), 0.48f);
        spawnedObjects.Add(field);
    }

    private void ReconcileAgents(int desiredCount)
    {
        while (activeAgents.Count < desiredCount)
        {
            SpawnAgent(activeAgents.Count);
        }

        while (activeAgents.Count > desiredCount)
        {
            var lastIndex = activeAgents.Count - 1;
            var agent = activeAgents[lastIndex];
            activeAgents.RemoveAt(lastIndex);
            if (agent != null)
            {
                spawnedObjects.Remove(agent.gameObject);
                Destroy(agent.gameObject);
            }
        }
    }

    private void SpawnAgent(int index)
    {
        GameObject agentObject = agentPrefab != null
            ? Instantiate(agentPrefab, simulationRoot)
            : GameObject.CreatePrimitive(PrimitiveType.Sphere);

        agentObject.name = "SciLoop AI Agent " + index;
        agentObject.transform.SetParent(simulationRoot, false);
        var angle = index * 137.5f * Mathf.Deg2Rad;
        var radius = Mathf.Sqrt(index + 1f) / Mathf.Sqrt(Mathf.Max(1, currentVariables.population)) * spawnRadius;
        agentObject.transform.position = new Vector3(Mathf.Cos(angle) * radius, 1f, Mathf.Sin(angle) * radius);
        agentObject.transform.localScale = Vector3.one * Mathf.Lerp(0.22f, 0.5f, Mathf.Clamp01(currentVariables.energy / 100f));
        ApplyColor(agentObject, Color.Lerp(new Color(0.35f, 0.92f, 1f), new Color(1f, 0.82f, 0.32f), Mathf.Clamp01(currentVariables.energy / 100f)), 0.9f);

        var body = agentObject.GetComponent<Rigidbody>();
        if (body == null) body = agentObject.AddComponent<Rigidbody>();
        body.mass = Mathf.Lerp(0.6f, 1.8f, Mathf.Clamp01(currentVariables.gravity / 20f));
        body.drag = 0.2f;
        body.angularDrag = 0.35f;

        var agent = agentObject.GetComponent<AgentAI>();
        if (agent == null) agent = agentObject.AddComponent<AgentAI>();
        agent.Initialize(this, currentVariables.speed, currentVariables.energy, spawnRadius);
        activeAgents.Add(agent);
        spawnedObjects.Add(agentObject);
    }

    private void SpawnResources(int count, float energyValue)
    {
        for (var i = 0; i < count; i += 1)
        {
            GameObject resourceObject = energyParticlePrefab != null
                ? Instantiate(energyParticlePrefab, simulationRoot)
                : GameObject.CreatePrimitive(PrimitiveType.Sphere);

            resourceObject.name = "SciLoop Energy Particle " + i;
            resourceObject.transform.SetParent(simulationRoot, false);
            resourceObject.transform.localScale = Vector3.one * 0.18f;
            resourceObject.transform.position = RandomPointOnFloor();
            ApplyColor(resourceObject, new Color(1f, 0.82f, 0.32f), 0.95f);

            var resource = resourceObject.GetComponent<EnergyParticle>();
            if (resource == null) resource = resourceObject.AddComponent<EnergyParticle>();
            resource.Initialize(energyValue, spawnRadius);
            activeResources.Add(resource);
            spawnedObjects.Add(resourceObject);
        }
    }

    public List<EnergyParticle> GetResources()
    {
        return activeResources;
    }

    public Vector3 RandomPointOnFloor()
    {
        var circle = UnityEngine.Random.insideUnitCircle * spawnRadius;
        return new Vector3(circle.x, 0.35f, circle.y);
    }

    private void Update()
    {
        if (Time.time >= nextReportTime)
        {
            nextReportTime = Time.time + Mathf.Max(0.1f, reportIntervalSeconds);
            SendResultsToBrowser();
        }
    }

    private SimulationResults CalculateResults()
    {
        var aliveCount = 0;
        var energyTotal = 0f;
        foreach (var agent in activeAgents)
        {
            if (agent == null || !agent.IsAlive) continue;
            aliveCount += 1;
            energyTotal += agent.CurrentEnergy;
        }

        var temperatureStress = Mathf.Clamp01(Mathf.Abs(currentVariables.temperature - 24f) / 80f);
        var crowdStress = Mathf.Clamp01(Mathf.Max(0, currentVariables.population - 45) / 95f);
        var energyBoost = Mathf.Clamp01(currentVariables.energy / 100f) * 0.12f;
        var stability = Mathf.Clamp01(0.92f - temperatureStress * 0.5f - crowdStress * 0.28f + energyBoost);

        return new SimulationResults
        {
            aliveAgents = aliveCount,
            averageEnergy = aliveCount > 0 ? energyTotal / aliveCount : 0f,
            collisionCount = collisionCount,
            stabilityScore = stability
        };
    }

    private void SendResultsToBrowser()
    {
        var json = JsonUtility.ToJson(CalculateResults());
        Debug.Log("[SciLoop Unity Bridge] Results: " + json);
        if (!reportToBrowser) return;

#if UNITY_WEBGL && !UNITY_EDITOR
        Application.ExternalCall("receiveUnityResults", json);
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
