using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class RealitySceneController : MonoBehaviour
    {
        [SerializeField] private TimelineTransitionSystem timelineTransitionSystem;
        [SerializeField] private EntropyVisualizationSystem entropyVisualizationSystem;
        [SerializeField] private ScalePropagationSystem scalePropagationSystem;
        [SerializeField] private FutureBranchEngine futureBranchEngine;
        [SerializeField] private CausalVisualizationEngine causalVisualizationEngine;
        [SerializeField] private NpcLifeSimulation npcLifeSimulation;
        [SerializeField] private AtmosphericStoryEngine atmosphericStoryEngine;

        public void LoadSceneJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                Debug.LogWarning("SciLoop Reality Engine received empty scene JSON.");
                return;
            }

            var payload = JsonUtility.FromJson<RealityScenePayload>(json);
            if (payload == null)
            {
                Debug.LogWarning("SciLoop Reality Engine could not parse scene JSON.");
                return;
            }

            atmosphericStoryEngine?.ApplyWorldMood(payload.before_world, payload.after_world);
            timelineTransitionSystem?.LoadTimeline(payload.timeline);
            entropyVisualizationSystem?.VisualizeEntropyShift(payload.before_world, payload.after_world);
            scalePropagationSystem?.SetInnovation(payload.innovation_name, payload.field);
            futureBranchEngine?.LoadBranches(payload.future_branches);
            causalVisualizationEngine?.BuildCausalPath(payload);
            npcLifeSimulation?.ApplyBeforeAfterBehavior(payload.before_world, payload.after_world);

            Debug.Log($"SciLoop Reality scene loaded: {payload.innovation_name}");
        }
    }
}
