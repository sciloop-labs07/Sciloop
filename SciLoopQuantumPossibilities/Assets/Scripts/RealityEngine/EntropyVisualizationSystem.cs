using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class EntropyVisualizationSystem : MonoBehaviour
    {
        [SerializeField] private ParticleSystem entropyParticles;

        public void VisualizeEntropyShift(RealityWorld beforeWorld, RealityWorld afterWorld)
        {
            if (entropyParticles == null) return;
            var emission = entropyParticles.emission;
            emission.rateOverTime = beforeWorld == null ? 20f : 80f;
            Debug.Log("Entropy visualization prepared: scattered particles should organize after discovery.");
        }
    }
}
