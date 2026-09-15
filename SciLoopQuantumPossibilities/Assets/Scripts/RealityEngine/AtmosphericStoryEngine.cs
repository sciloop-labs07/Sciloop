using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class AtmosphericStoryEngine : MonoBehaviour
    {
        [SerializeField] private Light keyLight;

        public void ApplyWorldMood(RealityWorld beforeWorld, RealityWorld afterWorld)
        {
            if (keyLight != null)
            {
                keyLight.color = new Color(0.45f, 0.85f, 1f);
                keyLight.intensity = 1.5f;
            }

            Debug.Log($"Atmosphere before: {beforeWorld?.atmosphere}");
            Debug.Log($"Atmosphere after: {afterWorld?.atmosphere}");
        }
    }
}
