const MAX_INPUT_CHARS = 3000;
const MAX_TOPIC_CHARS = 200;

const STYLE_LABELS = {
  simple: "Simple Explanation",
  kid: "Kid Explanation",
  student: "Student Exam Explanation",
  investor: "Investor Demo Explanation",
  first_principles: "First-Principles Explanation",
};

const STORY_FORMAT_LABELS = {
  emoji_timeline: "Emoji Timeline",
  discovery_journey: "Discovery Journey",
  inventor_story: "Inventor Story",
  problem_breakthrough_impact: "Problem -> Breakthrough -> Impact",
  kid_visual_story: "Kid Visual Story",
};

const DOMAIN_TEMPLATES = {
  physics: ["field lines", "mass", "motion path"],
  biology: ["cell", "signal pathway", "environment"],
  chemistry: ["molecule", "reaction chamber", "energy view"],
  "space/cosmic": ["planet", "trajectory arc", "gravity field"],
  "computer science": ["queue", "processor", "task timeline"],
  mathematics: ["graph plane", "transform slider", "equation view"],
  "local problem": ["city map", "resource nodes", "impact zones"],
};

function cleanText(value, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  return text.replace(/\s+/g, " ").slice(0, maxLength);
}

function titleFromInput(input, fallback) {
  const cleaned = cleanText(input, 80);
  if (!cleaned) return fallback;
  return cleaned
    .split(" ")
    .slice(0, 8)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function keyPointsFromInput(input) {
  const words = cleanText(input, 600).split(" ").filter(Boolean);
  const phrase = words.slice(0, 10).join(" ");
  return [
    phrase ? `Core topic detected: ${phrase}.` : "Core topic detected from developer input.",
    "This response is structured for inspection before anything reaches SciLoop users.",
    "The current phase favors safe preview output over automation.",
  ];
}

export function validateInputText(input, fieldName = "input", maxLength = MAX_INPUT_CHARS) {
  const cleaned = typeof input === "string" ? input.trim() : "";
  if (!cleaned) {
    return `${fieldName} is required`;
  }
  if (cleaned.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }
  return null;
}

export function validateTopic(topic) {
  return validateInputText(topic, "topic", MAX_TOPIC_CHARS);
}

export function createMockAIExplanation({ input, style = "simple", provider = "mock" }) {
  const safeInput = cleanText(input, MAX_INPUT_CHARS);
  const title = `${STYLE_LABELS[style] || "Developer Explanation"} Preview`;

  return {
    mode: "mock",
    provider,
    style,
    inputChars: safeInput.length,
    output: {
      title,
      summary: `ForLoop mock mode simplified the input into a ${style} explanation so developers can inspect structure without making a paid AI call.`,
      keyPoints: keyPointsFromInput(safeInput),
      whyItMatters: "This helps validate the shape of the explanation pipeline before it is connected to live providers or user-facing flows.",
      limitations: "Mock mode only. No real AI call was made.",
    },
  };
}

export function createStoryPreview({ input, format = "emoji_timeline", mode = "mock" }) {
  const safeInput = cleanText(input, MAX_INPUT_CHARS);
  const storyTitle = `${titleFromInput(safeInput, "Discovery Story")} Preview`;
  const hook = "A difficult scientific idea becomes easier to hold when the problem, experiment, and impact are staged like a visible journey.";

  return {
    mode,
    story: {
      title: storyTitle,
      hook,
      timeline: [
        { step: "Problem", text: "Researchers were facing a hard-to-see constraint or unanswered question." },
        { step: "Experiment", text: `The developer input points toward this topic: ${safeInput.slice(0, 160) || "No input provided."}` },
        { step: "Breakthrough", text: "A clear mechanism or pattern emerges that can be turned into explanation and simulation surfaces." },
        { step: "Impact", text: "SciLoop can present the result as a story, simulation, or guided learning experience once reviewed." },
      ],
      formatLabel: STORY_FORMAT_LABELS[format] || "Story Preview",
      peopleOrTeams: "Not extracted in mock mode.",
      breakthroughMechanism: "Preview logic uses a deterministic narrative frame instead of a live model.",
      impact: "This preview helps developers review tone, pacing, and educational framing.",
      visualSimulationIdea: "Show the system shifting from confusion to visible cause-and-effect states.",
      emojiLine: "🧩 -> 🧪 -> ⚡ -> 🌍",
    },
  };
}

export function createNewsDryRun({ sourceMode = "mock", category = "Physics", input = "" }) {
  const safeInput = cleanText(input, MAX_INPUT_CHARS);
  const title = titleFromInput(safeInput, `${category} Mock Discovery`);
  const relevanceScore = Math.max(58, Math.min(94, 60 + Math.floor((safeInput.length || 40) / 18)));

  return {
    mode: sourceMode === "existing" ? "dry_run" : "mock",
    items: [
      {
        title,
        category,
        source: sourceMode === "manual" ? "Manual Text" : sourceMode === "existing" ? "Existing News Engine" : "Mock Source",
        relevanceScore,
        duplicateRisk: safeInput.length > 500 ? "medium" : "low",
        summaryReady: true,
        publishReady: false,
        warnings: ["Dry run only. Not published."],
      },
    ],
  };
}

export function createParsedNewsText({ input, category = "Physics" }) {
  const safeInput = cleanText(input, MAX_INPUT_CHARS);
  const title = titleFromInput(safeInput, `${category} Parsed Item`);

  return {
    mode: "manual_text",
    items: [
      {
        title,
        sourceMode: "Manual URL/Text",
        category,
        relevanceScore: Math.max(52, Math.min(90, 55 + Math.floor((safeInput.length || 30) / 20))),
        duplicateRisk: safeInput.split(" ").length > 120 ? "medium" : "low",
        summaryReady: Boolean(safeInput),
        publishReady: false,
        warnings: ["Manual parse only. No fetch or publish performed."],
      },
    ],
  };
}

export function createSimulationPlan({ topic, domain = "physics", level = "text", mode = "template" }) {
  const safeTopic = cleanText(topic, MAX_TOPIC_CHARS);
  const normalizedDomain = String(domain || "physics").toLowerCase();
  const objects = DOMAIN_TEMPLATES[normalizedDomain] || ["main actor", "supporting actor", "control view"];

  return {
    mode,
    plan: {
      sceneTitle: `${titleFromInput(safeTopic, "Simulation")} Visualizer`,
      learningGoal: `Help developers preview how ${safeTopic || "the selected topic"} could be explained visually.`,
      objects,
      lawsShown: [
        "Cause and effect",
        "State change",
        "Observable relationship",
      ],
      visualSteps: [
        "Show a neutral baseline scene.",
        `Introduce the main entities for ${safeTopic || "the topic"}.`,
        "Animate the key change or interaction step by step.",
        "Expose one control that lets the user vary the system.",
      ],
      userControls: ["mode toggle", "speed control", "focus selector"],
      limitations: "Template plan only. Not a physics-accurate or production renderer.",
      futureUpgrade: "Connect this planner to a real simulation renderer or scene generator in a later phase.",
      level,
      domain: normalizedDomain,
    },
  };
}
