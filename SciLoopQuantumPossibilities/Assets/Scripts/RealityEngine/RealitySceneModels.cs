using System;
using UnityEngine;

namespace SciLoop.RealityEngine
{
    [Serializable]
    public class RealityScenePayload
    {
        public string innovation_name;
        public string field;
        public RealityWorld before_world;
        public RealityWorld after_world;
        public RealityBranch[] future_branches;
        public RealityTimelineEvent[] timeline;
    }

    [Serializable]
    public class RealityWorld
    {
        public string summary;
        public string atmosphere;
        public string npc_behavior;
        public string infrastructure;
    }

    [Serializable]
    public class RealityBranch
    {
        public string id;
        public string title;
        public string description;
        public string risk;
        public string opportunity;
    }

    [Serializable]
    public class RealityTimelineEvent
    {
        public string id;
        public string label;
        public string eventDescription;
        public string emotion;
    }
}
