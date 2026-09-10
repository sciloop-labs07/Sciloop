using System;
using System.Collections.Generic;
using UnityEngine;

public class SciLoopRealitySceneController : MonoBehaviour
{
    [Header("Visual Defaults")]
    [SerializeField] private Material lineMaterial;
    [SerializeField] private Font labelFont;
    [SerializeField] private float defaultLineWidth = 0.045f;
    [SerializeField] private float defaultLabelHeight = 0.85f;
    [SerializeField] private float defaultLabelScale = 0.12f;

    [Serializable]
    public class UnitySceneEnvelope
    {
        public bool ok = true;
        public string protocol = "";
        public string type = "";
        public string schemaVersion = "";
        public string generatedAt = "";
        public string source = "";
        public string visualPlanId = "";
        public string subject = "";
        public string title = "";
        public string renderIntent = "";
        public Transport transport = new Transport();
        public Safety safety = new Safety();
        public UnityConfig unity = new UnityConfig();
        public ScenePayload scene = new ScenePayload();
    }

    [Serializable]
    public class Transport
    {
        public string mode = "";
        public string webglObjectName = "";
        public string webglMethodName = "";
    }

    [Serializable]
    public class Safety
    {
        public bool executeGeneratedCode;
        public bool acceptsOnlyJson;
        public int maxObjects = 16;
        public int maxEffects = 24;
        public string[] notes = Array.Empty<string>();
    }

    [Serializable]
    public class UnityConfig
    {
        public string sceneRoot = "SciLoopGeneratedVisualRoot";
        public string recommendedReceiver = "";
        public string renderPipeline = "";
        public string targetQuality = "";
        public string buildTarget = "";
    }

    [Serializable]
    public class ScenePayload
    {
        public EnvironmentConfig environment = new EnvironmentConfig();
        public CameraConfig camera = new CameraConfig();
        public MaterialConfig[] materials = Array.Empty<MaterialConfig>();
        public SceneObject[] objects = Array.Empty<SceneObject>();
        public SceneEffect[] effects = Array.Empty<SceneEffect>();
        public SceneLabel[] labels = Array.Empty<SceneLabel>();
        public TimelineEvent[] animationTimeline = Array.Empty<TimelineEvent>();
    }

    [Serializable]
    public class EnvironmentConfig
    {
        public string type = "";
        public string lighting = "";
        public string background = "";
    }

    [Serializable]
    public class CameraConfig
    {
        public string mode = "orbit";
        public float[] position = new float[] { 0f, 2.6f, 7.5f };
        public float[] lookAt = new float[] { 0f, 0.4f, 0f };
        public float fov = 55f;
    }

    [Serializable]
    public class MaterialConfig
    {
        public string name = "";
        public string color = "#53e7ff";
        public bool emissive;
        public bool transparent;
    }

    [Serializable]
    public class SceneObject
    {
        public string id = "";
        public string type = "node";
        public string label = "";
        public string color = "#53e7ff";
        public float[] position = new float[] { 0f, 0f, 0f };
        public float[] scale = new float[] { 1f, 1f, 1f };
    }

    [Serializable]
    public class SceneEffect
    {
        public string id = "";
        public string type = "energy_flow";
        public string from = "";
        public string to = "";
        public string label = "";
        public string color = "#53e7ff";
        public float intensity = 1f;
    }

    [Serializable]
    public class SceneLabel
    {
        public string target = "";
        public string text = "";
    }

    [Serializable]
    public class TimelineEvent
    {
        public float time;
        public string @event = "";
    }

    private const string ExpectedProtocol = "sciloop-unity-visual-bridge-v0.1";
    private readonly Dictionary<string, GameObject> objectIndex = new Dictionary<string, GameObject>();
    private GameObject sceneRoot;

    public string LastLoadedSceneId { get; private set; } = "";
    public string LastLoadedSubject { get; private set; } = "";

    public void LoadSceneJson(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            Debug.LogWarning("[SciLoop Unity] Empty scene JSON received.");
            return;
        }

        UnitySceneEnvelope envelope;
        try
        {
            envelope = JsonUtility.FromJson<UnitySceneEnvelope>(json);
        }
        catch (Exception error)
        {
            Debug.LogError("[SciLoop Unity] Failed to parse JSON: " + error.Message);
            return;
        }

        if (!ValidateEnvelope(envelope))
        {
            return;
        }

        BuildScene(envelope);
    }

    private bool ValidateEnvelope(UnitySceneEnvelope envelope)
    {
        if (envelope == null)
        {
            Debug.LogError("[SciLoop Unity] Envelope was null.");
            return false;
        }

        if (!string.Equals(envelope.protocol, ExpectedProtocol, StringComparison.Ordinal))
        {
            Debug.LogError("[SciLoop Unity] Unsupported protocol: " + envelope.protocol);
            return false;
        }

        if (envelope.safety != null && envelope.safety.executeGeneratedCode)
        {
            Debug.LogError("[SciLoop Unity] Envelope requested runtime code execution, which is blocked.");
            return false;
        }

        return true;
    }

    private void BuildScene(UnitySceneEnvelope envelope)
    {
        ResetSceneRoot(envelope.unity != null ? envelope.unity.sceneRoot : "SciLoopGeneratedVisualRoot");
        objectIndex.Clear();

        var objects = envelope.scene != null && envelope.scene.objects != null
            ? envelope.scene.objects
            : Array.Empty<SceneObject>();

        foreach (var sceneObject in objects)
        {
            var instance = CreatePrimitiveForObject(sceneObject);
            objectIndex[sceneObject.id] = instance;
        }

        CreateEffects(envelope.scene != null ? envelope.scene.effects : null);
        CreateLabels(envelope.scene != null ? envelope.scene.labels : null);

        PositionCamera(envelope.scene != null ? envelope.scene.camera : null);

        LastLoadedSceneId = envelope.visualPlanId ?? "";
        LastLoadedSubject = envelope.subject ?? "";
        Debug.Log("[SciLoop Unity] Loaded scene: " + envelope.title + " (" + LastLoadedSubject + ")");
    }

    private void ResetSceneRoot(string rootName)
    {
        if (sceneRoot != null)
        {
            Destroy(sceneRoot);
        }

        sceneRoot = new GameObject(string.IsNullOrWhiteSpace(rootName) ? "SciLoopGeneratedVisualRoot" : rootName);
        sceneRoot.transform.SetParent(transform, false);
    }

    private GameObject CreatePrimitiveForObject(SceneObject sceneObject)
    {
        var primitive = PrimitiveType.Sphere;
        if (sceneObject.type == "field" || sceneObject.type == "world_panel")
        {
            primitive = PrimitiveType.Cube;
        }
        else if (sceneObject.type == "boundary")
        {
            primitive = PrimitiveType.Cylinder;
        }
        else if (sceneObject.type == "energy_core")
        {
            primitive = PrimitiveType.Sphere;
        }

        var instance = GameObject.CreatePrimitive(primitive);
        instance.name = string.IsNullOrWhiteSpace(sceneObject.label) ? sceneObject.id : sceneObject.label;
        instance.transform.SetParent(sceneRoot.transform, false);
        instance.transform.localPosition = ToVector3(sceneObject.position, Vector3.zero);
        instance.transform.localScale = ToVector3(sceneObject.scale, Vector3.one);
        ApplyShapeTuning(instance, sceneObject.type);

        var renderer = instance.GetComponent<Renderer>();
        if (renderer != null)
        {
            renderer.material = BuildSurfaceMaterial(ParseColor(sceneObject.color, Color.cyan), sceneObject.type);

            if (sceneObject.type == "energy_core")
            {
                renderer.material.EnableKeyword("_EMISSION");
                renderer.material.SetColor("_EmissionColor", renderer.material.color * 1.2f);
            }
        }

        return instance;
    }

    private void CreateEffects(SceneEffect[] effects)
    {
        if (effects == null || effects.Length == 0)
        {
            return;
        }

        foreach (var effect in effects)
        {
            if (string.IsNullOrWhiteSpace(effect.from) || string.IsNullOrWhiteSpace(effect.to))
            {
                continue;
            }

            if (!objectIndex.TryGetValue(effect.from, out var fromObject) || !objectIndex.TryGetValue(effect.to, out var toObject))
            {
                continue;
            }

            var effectRoot = new GameObject(string.IsNullOrWhiteSpace(effect.id) ? "Effect" : effect.id);
            effectRoot.transform.SetParent(sceneRoot.transform, false);

            var lineRenderer = effectRoot.AddComponent<LineRenderer>();
            lineRenderer.useWorldSpace = false;
            lineRenderer.positionCount = 2;
            lineRenderer.SetPosition(0, fromObject.transform.localPosition);
            lineRenderer.SetPosition(1, toObject.transform.localPosition);
            lineRenderer.widthMultiplier = defaultLineWidth * Mathf.Clamp(effect.intensity, 0.6f, 2.5f);
            lineRenderer.material = BuildLineMaterial(ParseColor(effect.color, Color.cyan));
            lineRenderer.startColor = ParseColor(effect.color, Color.cyan);
            lineRenderer.endColor = ParseColor(effect.color, Color.cyan);
            lineRenderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            lineRenderer.receiveShadows = false;
            lineRenderer.textureMode = LineTextureMode.Stretch;

            if (!string.IsNullOrWhiteSpace(effect.label))
            {
                CreateWorldLabel(effect.label, Midpoint(fromObject.transform.localPosition, toObject.transform.localPosition) + Vector3.up * 0.3f, ParseColor(effect.color, Color.white), effectRoot.transform);
            }
        }
    }

    private void CreateLabels(SceneLabel[] labels)
    {
        if (labels == null || labels.Length == 0)
        {
            foreach (var pair in objectIndex)
            {
                CreateWorldLabel(pair.Value.name, pair.Value.transform.localPosition + Vector3.up * defaultLabelHeight, Color.white, pair.Value.transform);
            }

            return;
        }

        foreach (var label in labels)
        {
            if (string.IsNullOrWhiteSpace(label.target) || string.IsNullOrWhiteSpace(label.text))
            {
                continue;
            }

            if (!objectIndex.TryGetValue(label.target, out var targetObject))
            {
                continue;
            }

            CreateWorldLabel(label.text, targetObject.transform.localPosition + Vector3.up * defaultLabelHeight, Color.white, targetObject.transform);
        }
    }

    private void CreateWorldLabel(string text, Vector3 localPosition, Color color, Transform parentTransform)
    {
        var labelObject = new GameObject("Label");
        labelObject.transform.SetParent(parentTransform != null ? parentTransform : sceneRoot.transform, false);
        labelObject.transform.localPosition = parentTransform != null ? Vector3.up * defaultLabelHeight : localPosition;

        var textMesh = labelObject.AddComponent<TextMesh>();
        textMesh.text = text;
        textMesh.fontSize = 48;
        textMesh.characterSize = defaultLabelScale;
        textMesh.anchor = TextAnchor.MiddleCenter;
        textMesh.alignment = TextAlignment.Center;
        textMesh.color = color;

        if (labelFont != null)
        {
            textMesh.font = labelFont;
            var meshRenderer = textMesh.GetComponent<MeshRenderer>();
            if (meshRenderer != null)
            {
                meshRenderer.material = labelFont.material;
                meshRenderer.material.color = color;
            }
        }
    }

    private void ApplyShapeTuning(GameObject instance, string objectType)
    {
        if (instance == null)
        {
            return;
        }

        if (objectType == "field")
        {
            instance.transform.localScale = Vector3.Scale(instance.transform.localScale, new Vector3(1.6f, 0.12f, 1.6f));
        }
        else if (objectType == "world_panel")
        {
            instance.transform.localScale = Vector3.Scale(instance.transform.localScale, new Vector3(1.4f, 0.4f, 0.2f));
        }
        else if (objectType == "particle_stream")
        {
            instance.transform.localScale = Vector3.Scale(instance.transform.localScale, new Vector3(0.45f, 0.45f, 1.5f));
        }
        else if (objectType == "boundary")
        {
            instance.transform.localScale = Vector3.Scale(instance.transform.localScale, new Vector3(1f, 0.18f, 1f));
        }
    }

    private Material BuildSurfaceMaterial(Color color, string objectType)
    {
        var material = new Material(Shader.Find("Standard"));
        material.color = color;

        if (objectType == "field" || objectType == "world_panel")
        {
            material.SetFloat("_Glossiness", 0.18f);
            material.EnableKeyword("_EMISSION");
            material.SetColor("_EmissionColor", color * 0.35f);
        }
        else if (objectType == "particle_stream")
        {
            material.SetFloat("_Glossiness", 0.55f);
        }

        return material;
    }

    private Material BuildLineMaterial(Color color)
    {
        if (lineMaterial != null)
        {
            var copy = new Material(lineMaterial);
            copy.color = color;
            return copy;
        }

        var material = new Material(Shader.Find("Sprites/Default"));
        material.color = color;
        return material;
    }

    private void PositionCamera(CameraConfig cameraConfig)
    {
        var mainCamera = Camera.main;
        if (mainCamera == null)
        {
            return;
        }

        if (cameraConfig == null)
        {
            mainCamera.transform.position = new Vector3(0f, 2.6f, 7.5f);
            mainCamera.transform.LookAt(new Vector3(0f, 0.4f, 0f));
            return;
        }

        mainCamera.fieldOfView = cameraConfig.fov > 1f ? cameraConfig.fov : 55f;
        mainCamera.transform.position = ToVector3(cameraConfig.position, new Vector3(0f, 2.6f, 7.5f));
        mainCamera.transform.LookAt(ToVector3(cameraConfig.lookAt, new Vector3(0f, 0.4f, 0f)));
    }

    private static Vector3 ToVector3(float[] values, Vector3 fallback)
    {
        if (values == null || values.Length < 3)
        {
            return fallback;
        }

        return new Vector3(values[0], values[1], values[2]);
    }

    private static Color ParseColor(string hexColor, Color fallback)
    {
        if (!string.IsNullOrWhiteSpace(hexColor) && ColorUtility.TryParseHtmlString(hexColor, out var parsed))
        {
            return parsed;
        }

        return fallback;
    }

    private static Vector3 Midpoint(Vector3 a, Vector3 b)
    {
        return new Vector3(
            (a.x + b.x) * 0.5f,
            (a.y + b.y) * 0.5f,
            (a.z + b.z) * 0.5f
        );
    }
}
