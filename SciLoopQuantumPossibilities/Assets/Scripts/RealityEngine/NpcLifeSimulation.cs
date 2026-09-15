using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class NpcLifeSimulation : MonoBehaviour
    {
        public void ApplyBeforeAfterBehavior(RealityWorld beforeWorld, RealityWorld afterWorld)
        {
            Debug.Log($"NPC before behavior: {beforeWorld?.npc_behavior}");
            Debug.Log($"NPC after behavior: {afterWorld?.npc_behavior}");
        }
    }
}
