using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class ScalePropagationSystem : MonoBehaviour
    {
        private static readonly string[] Scales = { "Atom", "Cell", "Human", "City", "Planet", "Space Civilization" };

        public void SetInnovation(string innovationName, string field)
        {
            Debug.Log($"Scale propagation ready for {innovationName} in {field}.");
        }

        public string GetScaleLabel(int index)
        {
            return Scales[Mathf.Clamp(index, 0, Scales.Length - 1)];
        }
    }
}
