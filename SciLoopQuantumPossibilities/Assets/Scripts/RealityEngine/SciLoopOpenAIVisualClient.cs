using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace SciLoop.RealityEngine
{
    public class SciLoopOpenAIVisualClient : MonoBehaviour
    {
        [Header("SciLoop Backend")]
        [SerializeField] private string backendVisualEndpoint = "http://localhost:5050/api/reality-engine/openai-visual";
        [SerializeField] private GeneratedVisualApplier generatedVisualApplier;

        [Header("Demo Prompt")]
        [SerializeField] private string demoTitle = "Mass bends spacetime and curves light";
        [SerializeField] private string demoField = "Physics";
        [TextArea(2, 5)]
        [SerializeField] private string demoSummary = "Show a massive body, curved field, bending light, and a future discovery branch.";

        public void GenerateDemoVisual()
        {
            GenerateVisual(demoTitle, demoSummary, demoField);
        }

        public void GenerateVisual(string title, string summary, string field)
        {
            var payload = new OpenAIVisualRequest
            {
                title = title,
                summary = summary,
                field = field,
                prompt = $"{title}\n{summary}"
            };

            StartCoroutine(PostVisualRequest(payload));
        }

        private IEnumerator PostVisualRequest(OpenAIVisualRequest payload)
        {
            if (string.IsNullOrWhiteSpace(backendVisualEndpoint))
            {
                Debug.LogWarning("SciLoop OpenAI visual endpoint is empty.");
                yield break;
            }

            string json = JsonUtility.ToJson(payload);
            using UnityWebRequest request = new UnityWebRequest(backendVisualEndpoint, "POST");
            request.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(json));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.timeout = 20;
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogWarning($"SciLoop visual backend failed: {request.responseCode} {request.error}");
                yield break;
            }

            string responseText = request.downloadHandler.text;
            var response = JsonUtility.FromJson<OpenAIVisualResponse>(responseText);
            if (response == null || response.visualScene == null)
            {
                Debug.LogWarning($"SciLoop visual backend returned invalid JSON: {responseText}");
                yield break;
            }

            Debug.Log($"SciLoop visual scene ready via {response.providerUsed}. Fallback: {response.fallback}");
            generatedVisualApplier?.Apply(response.visualScene);
        }
    }
}
