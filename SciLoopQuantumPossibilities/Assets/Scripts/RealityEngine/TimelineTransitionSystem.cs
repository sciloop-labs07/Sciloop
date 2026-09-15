using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class TimelineTransitionSystem : MonoBehaviour
    {
        private RealityTimelineEvent[] timelineEvents;
        private int currentIndex;

        public void LoadTimeline(RealityTimelineEvent[] events)
        {
            timelineEvents = events ?? new RealityTimelineEvent[0];
            currentIndex = 0;
            Debug.Log($"Loaded {timelineEvents.Length} SciLoop timeline events.");
        }

        public void JumpToStage(int index)
        {
            if (timelineEvents == null || timelineEvents.Length == 0) return;
            currentIndex = Mathf.Clamp(index, 0, timelineEvents.Length - 1);
            Debug.Log($"Timeline stage: {timelineEvents[currentIndex].label}");
        }
    }
}
