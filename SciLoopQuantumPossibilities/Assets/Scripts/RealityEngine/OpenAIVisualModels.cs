using System;

namespace SciLoop.RealityEngine
{
    [Serializable]
    public class OpenAIVisualRequest
    {
        public string title;
        public string summary;
        public string field;
        public string prompt;
    }

    [Serializable]
    public class OpenAIVisualResponse
    {
        public bool ok;
        public string providerUsed;
        public bool fallback;
        public string model;
        public OpenAIVisualScene visualScene;
        public string[] warnings;
    }

    [Serializable]
    public class OpenAIVisualScene
    {
        public string title;
        public string field;
        public string intent;
        public OpenAIVisualObject[] objects;
        public OpenAIVisualEffect[] effects;
        public string[] animationTimeline;
        public OpenAIVisualCamera camera;
        public string[] safetyNotes;
    }

    [Serializable]
    public class OpenAIVisualObject
    {
        public string id;
        public string type;
        public string label;
        public string color;
        public float[] position;
        public float[] scale;
    }

    [Serializable]
    public class OpenAIVisualEffect
    {
        public string id;
        public string type;
        public string from;
        public string to;
        public string color;
        public float intensity;
    }

    [Serializable]
    public class OpenAIVisualCamera
    {
        public string mode;
        public float distance;
    }
}
