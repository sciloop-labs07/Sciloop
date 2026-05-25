using System.Collections.Generic;
using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class GeneratedVisualApplier : MonoBehaviour
    {
        [SerializeField] private Transform sceneRoot;
        [SerializeField] private Material defaultMaterial;
        [SerializeField] private Material glowMaterial;

        private readonly Dictionary<string, GameObject> spawnedById = new Dictionary<string, GameObject>();

        public void Apply(OpenAIVisualScene scene)
        {
            if (scene == null)
            {
                Debug.LogWarning("Generated visual scene is null.");
                return;
            }

            Clear();
            Transform root = sceneRoot != null ? sceneRoot : transform;

            if (scene.objects != null)
            {
                foreach (OpenAIVisualObject visualObject in scene.objects)
                {
                    SpawnObject(root, visualObject);
                }
            }

            if (scene.effects != null)
            {
                foreach (OpenAIVisualEffect effect in scene.effects)
                {
                    SpawnEffect(root, effect);
                }
            }

            Debug.Log($"Applied generated visual scene: {scene.title}");
        }

        public void Clear()
        {
            foreach (GameObject spawned in spawnedById.Values)
            {
                if (spawned != null)
                {
                    Destroy(spawned);
                }
            }

            spawnedById.Clear();
        }

        private void SpawnObject(Transform root, OpenAIVisualObject visualObject)
        {
            if (visualObject == null) return;

            PrimitiveType primitiveType = visualObject.type == "boundary"
                ? PrimitiveType.Cube
                : visualObject.type == "field"
                    ? PrimitiveType.Cylinder
                    : PrimitiveType.Sphere;

            GameObject go = GameObject.CreatePrimitive(primitiveType);
            go.name = $"SciLoop_{SafeName(visualObject.id, visualObject.label)}";
            go.transform.SetParent(root, false);
            go.transform.localPosition = ToVector3(visualObject.position, Vector3.zero);
            go.transform.localScale = ToVector3(visualObject.scale, DefaultScaleFor(visualObject.type));

            Renderer renderer = go.GetComponent<Renderer>();
            if (renderer != null)
            {
                Material material = visualObject.type == "energy_core" && glowMaterial != null
                    ? new Material(glowMaterial)
                    : new Material(defaultMaterial != null ? defaultMaterial : renderer.sharedMaterial);

                material.color = ParseColor(visualObject.color, Color.cyan);
                renderer.material = material;
            }

            var label = new GameObject("Label");
            label.transform.SetParent(go.transform, false);
            label.transform.localPosition = Vector3.up * 1.1f;
            TextMesh text = label.AddComponent<TextMesh>();
            text.text = string.IsNullOrWhiteSpace(visualObject.label) ? visualObject.id : visualObject.label;
            text.anchor = TextAnchor.MiddleCenter;
            text.alignment = TextAlignment.Center;
            text.characterSize = 0.18f;
            text.color = Color.white;

            if (!string.IsNullOrWhiteSpace(visualObject.id))
            {
                spawnedById[visualObject.id] = go;
            }
        }

        private void SpawnEffect(Transform root, OpenAIVisualEffect effect)
        {
            if (effect == null || string.IsNullOrWhiteSpace(effect.from) || string.IsNullOrWhiteSpace(effect.to)) return;
            if (!spawnedById.TryGetValue(effect.from, out GameObject from)) return;
            if (!spawnedById.TryGetValue(effect.to, out GameObject to)) return;

            Vector3 start = from.transform.position;
            Vector3 end = to.transform.position;
            Vector3 center = (start + end) * 0.5f;
            Vector3 direction = end - start;
            float length = Mathf.Max(direction.magnitude, 0.01f);

            GameObject beam = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            beam.name = $"SciLoop_Effect_{SafeName(effect.id, effect.type)}";
            beam.transform.SetParent(root, false);
            beam.transform.position = center;
            beam.transform.up = direction.normalized;
            beam.transform.localScale = new Vector3(0.035f + effect.intensity * 0.02f, length * 0.5f, 0.035f + effect.intensity * 0.02f);

            Renderer renderer = beam.GetComponent<Renderer>();
            if (renderer != null)
            {
                Material material = new Material(glowMaterial != null ? glowMaterial : renderer.sharedMaterial);
                material.color = ParseColor(effect.color, Color.cyan);
                renderer.material = material;
            }
        }

        private static Vector3 ToVector3(float[] values, Vector3 fallback)
        {
            if (values == null || values.Length < 3) return fallback;
            return new Vector3(values[0], values[1], values[2]);
        }

        private static Vector3 DefaultScaleFor(string type)
        {
            if (type == "field") return new Vector3(3.5f, 0.03f, 3.5f);
            if (type == "boundary") return new Vector3(1.2f, 1.2f, 0.12f);
            if (type == "energy_core") return Vector3.one * 1.15f;
            return Vector3.one * 0.72f;
        }

        private static Color ParseColor(string htmlColor, Color fallback)
        {
            if (!string.IsNullOrWhiteSpace(htmlColor) && ColorUtility.TryParseHtmlString(htmlColor, out Color parsed))
            {
                return parsed;
            }

            return fallback;
        }

        private static string SafeName(string id, string label)
        {
            string raw = string.IsNullOrWhiteSpace(id) ? label : id;
            if (string.IsNullOrWhiteSpace(raw)) return "Generated";
            return raw.Replace(" ", "_").Replace("/", "_").Replace("\\", "_");
        }
    }
}
