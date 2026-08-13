import type {
  VisualAtomType,
  VisualRecipeEngine,
  VisualRecipePattern,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";

import type {
  VisualPattern,
  VisualPatternCategory,
  VisualPatternId,
  VisualPatternStage,
  VisualPatternUseCase,
} from "./visualPattern.types";

interface PatternSeed {
  id: VisualPatternId;
  name: string;
  shortDescription: string;
  deepPurpose: string;
  category: VisualPatternCategory;
  keywords: string[];
  atomsUsed: VisualAtomType[];
  visualType: VisualRecipeVisualType;
  recipePattern: VisualRecipePattern;
  stageLabels: [string, string, string];
  relationAtom?: "edge" | "cause" | "effect" | "feedback";
  flowMaterial?: "energy" | "information" | "attention" | "money" | "force" | "causality" | "matter";
  primaryEngine?: VisualRecipeEngine;
  fallbackEngines?: VisualRecipeEngine[];
  avoidWhen: string[];
  exampleConcepts: string[];
  tags: string[];
}

function slugPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stageFromLabel(label: string, index: number): VisualPatternStage {
  return {
    id: slugPart(label),
    label,
    description: `${label} is stage ${index + 1} in the explanation structure.`,
  };
}

function createUseCase(pattern: PatternSeed): VisualPatternUseCase {
  return {
    label: pattern.name,
    description: pattern.shortDescription,
    keywords: pattern.keywords,
  };
}

function createPattern(seed: PatternSeed): VisualPattern {
  const stages = seed.stageLabels.map(stageFromLabel);
  const relationAtom = seed.relationAtom ?? "edge";
  const primaryEngine = seed.primaryEngine ?? "svg-motion";

  return {
    id: seed.id,
    name: seed.name,
    shortDescription: seed.shortDescription,
    deepPurpose: seed.deepPurpose,
    category: seed.category,
    whenToUse: [createUseCase(seed)],
    avoidWhen: seed.avoidWhen,
    atomsUsed: seed.atomsUsed,
    visualType: seed.visualType,
    recipePattern: seed.recipePattern,
    defaultRecipeMode: "static",
    stages,
    layerTemplates: stages.map((stage, index) => ({
      id: `${stage.id}-layer`,
      title: stage.label,
      description: stage.description,
      depth: index,
      atomsUsed: index === 1 ? ["layer", "transformation"] : ["layer", seed.atomsUsed[Math.min(index, seed.atomsUsed.length - 1)]],
    })),
    objectTemplates: stages.map((stage, index) => ({
      id: `${stage.id}-object`,
      label: stage.label,
      atom: seed.atomsUsed[Math.min(index, seed.atomsUsed.length - 1)],
      layerId: `${stage.id}-layer`,
      description: `${stage.label} is the visible object for this reusable pattern stage.`,
      importance: index === stages.length - 1 ? 1 : 0.72 + index * 0.1,
    })),
    relationTemplates: [
      {
        id: `${seed.id}-relation-1`,
        fromObjectId: `${stages[0].id}-object`,
        toObjectId: `${stages[1].id}-object`,
        atom: relationAtom,
        label: `${stages[0].label} to ${stages[1].label}`,
        description: `Shows how ${stages[0].label.toLowerCase()} connects to ${stages[1].label.toLowerCase()}.`,
        strength: 0.78,
      },
      {
        id: `${seed.id}-relation-2`,
        fromObjectId: `${stages[1].id}-object`,
        toObjectId: `${stages[2].id}-object`,
        atom: relationAtom === "cause" ? "effect" : relationAtom,
        label: `${stages[1].label} to ${stages[2].label}`,
        description: `Shows how ${stages[1].label.toLowerCase()} produces ${stages[2].label.toLowerCase()}.`,
        strength: 0.84,
      },
    ],
    flowTemplates: seed.flowMaterial
      ? [
          {
            id: `${seed.id}-flow`,
            source: `${stages[0].id}-object`,
            target: `${stages[2].id}-object`,
            material: seed.flowMaterial,
            rate: 0.74,
            label: `${seed.flowMaterial} moves through ${seed.name}`,
          },
        ]
      : [],
    transformationTemplates: [
      {
        id: `${seed.id}-transformation`,
        before: `${stages[0].id}-object`,
        process: `${stages[1].id}-object`,
        after: `${stages[2].id}-object`,
        label: seed.name,
      },
    ],
    interactionTemplates: [
      {
        id: `${seed.id}-select-stage`,
        label: "Inspect stage",
        targetId: `${stages[1].id}-object`,
        controlType: "select",
        understandingEffect: "Selecting a stage explains its role in the reusable pattern.",
      },
    ],
    preferredEngines: [
      {
        primary: primaryEngine,
        alternatives: primaryEngine === "react-tailwind" ? ["svg-motion"] : ["react-tailwind"],
        reason: `${primaryEngine} is enough to express this pattern without adding a heavy engine.`,
      },
    ],
    fallbackEngines: seed.fallbackEngines ?? ["react-tailwind"],
    exampleConcepts: seed.exampleConcepts,
    understandingGoal: {
      userShouldUnderstand: [
        `How ${stages[0].label.toLowerCase()} becomes ${stages[2].label.toLowerCase()}.`,
        `Why the ${seed.name} pattern applies across multiple domains.`,
      ],
      successSignal: `User can map a new concept onto ${seed.name}.`,
    },
    tags: seed.tags,
  };
}

/**
 * Official SciLoop visual pattern memory.
 *
 * SciLoop should not create a new visual from zero every time. These patterns
 * give science, math, economics, AI, and daily-life explanations consistent
 * reusable structures that the human brain can learn and recognize.
 */
export const visualPatterns = [
  createPattern({
    id: "input-process-output",
    name: "Input -> Process -> Output",
    shortDescription: "Something enters a system, gets transformed, and produces an output.",
    deepPurpose: "Makes systems legible by separating what enters, what changes it, and what comes out.",
    category: "transformation",
    keywords: ["input", "process", "output", "system", "transform"],
    atomsUsed: ["information", "system", "effect"],
    visualType: "transformation",
    recipePattern: "comparison",
    stageLabels: ["Input", "Process", "Output"],
    flowMaterial: "information",
    avoidWhen: ["The concept has no meaningful transformation step."],
    exampleConcepts: ["Manufacturing", "API requests", "Learning from feedback"],
    tags: ["system", "transformation", "workflow"],
  }),
  createPattern({
    id: "problem-solution",
    name: "Problem -> Solution",
    shortDescription: "A challenge, bottleneck, invention, or fix becomes understandable.",
    deepPurpose: "Frames tension and resolution without hiding the obstacle.",
    category: "transformation",
    keywords: ["problem", "issue", "bottleneck", "solution", "fix", "challenge"],
    atomsUsed: ["uncertainty", "transformation", "effect"],
    visualType: "comparison",
    recipePattern: "comparison",
    stageLabels: ["Problem", "Intervention", "Solution"],
    relationAtom: "cause",
    avoidWhen: ["The explanation is exploratory and has no clear resolution."],
    exampleConcepts: ["Vaccine design", "Traffic congestion", "Bug fixing"],
    tags: ["problem", "solution", "invention"],
  }),
  createPattern({
    id: "cause-effect",
    name: "Cause -> Effect",
    shortDescription: "Shows why something happens.",
    deepPurpose: "Turns events into traceable causality.",
    category: "causality",
    keywords: ["cause", "effect", "because", "why", "result"],
    atomsUsed: ["cause", "edge", "effect"],
    visualType: "concept-map",
    recipePattern: "cause-effect",
    stageLabels: ["Cause", "Mechanism", "Effect"],
    relationAtom: "cause",
    flowMaterial: "causality",
    avoidWhen: ["The relationship is only correlation."],
    exampleConcepts: ["Rain formation", "Inflation pressure", "Disease spread"],
    tags: ["cause", "effect", "mechanism"],
  }),
  createPattern({
    id: "random-to-organized",
    name: "Random -> Organized",
    shortDescription: "Chaos becomes structure, signal, understanding, alignment, or useful work.",
    deepPurpose: "Shows the mind how order emerges from disorder.",
    category: "transformation",
    keywords: ["random", "organized", "noise", "signal", "chaos", "structure", "understanding"],
    atomsUsed: ["noise", "transformation", "pattern", "human-understanding"],
    visualType: "transformation",
    recipePattern: "random-to-organized",
    stageLabels: ["Random state", "Ordering process", "Organized result"],
    flowMaterial: "information",
    avoidWhen: ["The concept begins already ordered."],
    exampleConcepts: ["Heat becoming useful energy", "Raw data becoming insight", "Confused thought becoming understanding"],
    tags: ["order", "signal", "understanding"],
  }),
  createPattern({
    id: "hidden-visible-layer",
    name: "Hidden Layer -> Visible Layer",
    shortDescription: "An invisible mechanism produces visible results.",
    deepPurpose: "Makes unseen causes inspectable without pretending they are directly visible.",
    category: "layers",
    keywords: ["hidden", "visible", "layer", "mechanism", "behind"],
    atomsUsed: ["layer", "uncertainty", "effect"],
    visualType: "layered-reality",
    recipePattern: "layer-reveal",
    stageLabels: ["Hidden mechanism", "Translation layer", "Visible result"],
    relationAtom: "cause",
    avoidWhen: ["All important parts are directly observable."],
    exampleConcepts: ["Neural network layers", "Market incentives", "Subatomic causes"],
    tags: ["layer", "hidden", "visible"],
  }),
  createPattern({
    id: "micro-macro",
    name: "Micro -> Macro",
    shortDescription: "Small elements create large-scale behavior.",
    deepPurpose: "Connects tiny local rules to big emergent outcomes.",
    category: "scale",
    keywords: ["micro", "macro", "small", "large", "emergent", "scale"],
    atomsUsed: ["scale", "node", "system", "pattern"],
    visualType: "flow-system",
    recipePattern: "scale-shift",
    stageLabels: ["Micro elements", "Interaction rules", "Macro behavior"],
    avoidWhen: ["The large behavior is not built from smaller interactions."],
    exampleConcepts: ["Gas pressure", "Ant colony behavior", "Crowd motion"],
    tags: ["scale", "emergence", "system"],
  }),
  createPattern({
    id: "past-present-future",
    name: "Past -> Present -> Future",
    shortDescription: "Explains evolution, history, trajectory, or timeline.",
    deepPurpose: "Makes change over time visible as a structured sequence.",
    category: "timeline",
    keywords: ["past", "present", "future", "timeline", "evolution", "history"],
    atomsUsed: ["timeline", "transformation", "effect"],
    visualType: "timeline",
    recipePattern: "comparison",
    stageLabels: ["Past", "Present", "Future"],
    avoidWhen: ["Time ordering is not important to the concept."],
    exampleConcepts: ["Climate change", "Technology evolution", "Personal learning path"],
    tags: ["timeline", "future", "evolution"],
  }),
  createPattern({
    id: "system-feedback-loop",
    name: "System Feedback Loop",
    shortDescription: "Output affects future input.",
    deepPurpose: "Shows self-correction, amplification, and evolution inside systems.",
    category: "systems",
    keywords: ["feedback", "loop", "improve", "evolve", "iterate", "self-correct"],
    atomsUsed: ["system", "feedback", "flow", "effect"],
    visualType: "feedback-loop",
    recipePattern: "feedback-loop",
    stageLabels: ["Input", "System output", "Feedback into input"],
    relationAtom: "feedback",
    flowMaterial: "information",
    avoidWhen: ["The process is one-way and never loops back."],
    exampleConcepts: ["Thermostat", "Machine learning training", "Product iteration"],
    tags: ["feedback", "loop", "system"],
  }),
  createPattern({
    id: "network-growth",
    name: "Network Growth",
    shortDescription: "Spread, connection, collaboration, or graph growth becomes visible.",
    deepPurpose: "Shows how connections multiply meaning and reach.",
    category: "network",
    keywords: ["network", "growth", "spread", "connection", "collaboration", "graph"],
    atomsUsed: ["node", "edge", "flow", "pattern"],
    visualType: "network",
    recipePattern: "network-propagation",
    stageLabels: ["Seed node", "New connections", "Network effect"],
    flowMaterial: "information",
    avoidWhen: ["The concept has no relationship between actors or nodes."],
    exampleConcepts: ["Scientific collaboration", "Social sharing", "Knowledge spread"],
    tags: ["network", "graph", "growth"],
  }),
  createPattern({
    id: "energy-flow",
    name: "Energy Flow",
    shortDescription: "Energy moves, transforms, leaks, or becomes useful.",
    deepPurpose: "Makes invisible energy transfer readable as directed motion.",
    category: "systems",
    keywords: ["heat", "energy", "motion", "flow", "work", "power"],
    atomsUsed: ["energy", "flow", "system", "effect"],
    visualType: "flow-system",
    recipePattern: "energy-flow",
    stageLabels: ["Energy source", "Transfer path", "Useful output"],
    flowMaterial: "energy",
    primaryEngine: "canvas-2d",
    avoidWhen: ["The concept is not about transfer or transformation."],
    exampleConcepts: ["Heat engine", "Battery circuit", "Food metabolism"],
    tags: ["energy", "flow", "work"],
  }),
  createPattern({
    id: "signal-decomposition",
    name: "Signal Decomposition",
    shortDescription: "A complex signal separates into simpler readable parts.",
    deepPurpose: "Helps learners see hidden structure inside noisy or mixed information.",
    category: "learning",
    keywords: ["noise", "signal", "wave", "frequency", "fourier", "decomposition", "filter"],
    atomsUsed: ["signal", "pattern", "information", "human-understanding"],
    visualType: "signal-decomposition",
    recipePattern: "signal-decomposition",
    stageLabels: ["Mixed signal", "Component parts", "Readable spectrum"],
    flowMaterial: "information",
    avoidWhen: ["The concept is not made of separable components."],
    exampleConcepts: ["Fourier Transform", "Data analysis", "Audio equalization"],
    tags: ["signal", "wave", "frequency"],
  }),
  createPattern({
    id: "decision-tree",
    name: "Decision Tree",
    shortDescription: "Choices create branches.",
    deepPurpose: "Makes alternative paths and consequences visible before selection.",
    category: "decision",
    keywords: ["decision", "choice", "branch", "tree", "option"],
    atomsUsed: ["node", "edge", "effect", "uncertainty"],
    visualType: "decision-tree",
    recipePattern: "comparison",
    stageLabels: ["Choice point", "Branch options", "Outcome path"],
    avoidWhen: ["There are no meaningful alternatives."],
    exampleConcepts: ["Diagnosis flow", "Investment choices", "Algorithm branching"],
    tags: ["decision", "tree", "branch"],
  }),
  createPattern({
    id: "knowledge-graph",
    name: "Knowledge Graph",
    shortDescription: "Connected concepts form understanding.",
    deepPurpose: "Turns isolated ideas into navigable relationships.",
    category: "network",
    keywords: ["knowledge", "graph", "concept", "connected", "relationship"],
    atomsUsed: ["node", "edge", "information", "human-understanding"],
    visualType: "network",
    recipePattern: "network-propagation",
    stageLabels: ["Concept nodes", "Meaningful links", "Connected understanding"],
    flowMaterial: "information",
    avoidWhen: ["The explanation is linear and has no conceptual links."],
    exampleConcepts: ["Biology taxonomy", "AI concepts", "Research maps"],
    tags: ["knowledge", "graph", "concept-map"],
  }),
  createPattern({
    id: "conflict-resolution",
    name: "Conflict -> Resolution",
    shortDescription: "Opposing forces, contradictions, or tensions create a solution.",
    deepPurpose: "Shows why resolution requires holding both sides of the tension.",
    category: "transformation",
    keywords: ["conflict", "tension", "opposing", "contradiction", "resolution"],
    atomsUsed: ["cause", "uncertainty", "transformation", "effect"],
    visualType: "comparison",
    recipePattern: "comparison",
    stageLabels: ["Conflict", "Negotiation", "Resolution"],
    relationAtom: "cause",
    avoidWhen: ["There is no real opposition or tradeoff."],
    exampleConcepts: ["Design tradeoffs", "Physics equilibrium", "Policy compromise"],
    tags: ["conflict", "resolution", "tradeoff"],
  }),
  createPattern({
    id: "innovation-pipeline",
    name: "Innovation Pipeline",
    shortDescription: "An idea moves from observation to invention to product to impact.",
    deepPurpose: "Makes invention feel like a repeatable pathway rather than magic.",
    category: "transformation",
    keywords: ["invention", "innovation", "product", "pipeline", "idea", "impact"],
    atomsUsed: ["information", "transformation", "system", "effect"],
    visualType: "innovation-pipeline",
    recipePattern: "innovation-pipeline",
    stageLabels: ["Observation", "Invention", "Impact"],
    flowMaterial: "information",
    avoidWhen: ["The concept is not moving toward a useful output."],
    exampleConcepts: ["SciLoop product design", "Medical device invention", "Startup pipeline"],
    tags: ["innovation", "pipeline", "product"],
  }),
  createPattern({
    id: "field-influence",
    name: "Field Influence",
    shortDescription: "An invisible force field influences visible behavior.",
    deepPurpose: "Gives invisible influence a readable spatial structure.",
    category: "field",
    keywords: ["gravity", "magnet", "magnetic", "influence", "field", "force", "attention", "market"],
    atomsUsed: ["field", "flow", "effect", "uncertainty"],
    visualType: "field-influence",
    recipePattern: "cause-effect",
    stageLabels: ["Influence source", "Invisible field", "Visible motion"],
    relationAtom: "cause",
    flowMaterial: "force",
    avoidWhen: ["Influence is not spatial, invisible, or distributed."],
    exampleConcepts: ["Gravity", "Magnetism", "Social influence"],
    tags: ["field", "force", "influence"],
  }),
  createPattern({
    id: "compression-of-complexity",
    name: "Compression of Complexity",
    shortDescription: "Large complex reality becomes simple visual understanding.",
    deepPurpose: "Protects the learner from overload by preserving meaning while reducing detail.",
    category: "learning",
    keywords: ["data", "insight", "understanding", "complexity", "compress", "simplify"],
    atomsUsed: ["information", "transformation", "human-understanding", "signal"],
    visualType: "transformation",
    recipePattern: "random-to-organized",
    stageLabels: ["Complex reality", "Compression lens", "Simple understanding"],
    flowMaterial: "information",
    avoidWhen: ["The details themselves are the learning goal."],
    exampleConcepts: ["SciLoop Visual Understanding", "Dashboard summaries", "Scientific abstraction"],
    tags: ["complexity", "understanding", "compression"],
  }),
  createPattern({
    id: "multiple-possibilities-best-path",
    name: "Multiple Possibilities -> Best Path",
    shortDescription: "Options are explored and one direction is selected.",
    deepPurpose: "Shows exploration without making the final path feel arbitrary.",
    category: "decision",
    keywords: ["possibilities", "options", "best", "path", "select", "explore"],
    atomsUsed: ["uncertainty", "edge", "pattern", "effect"],
    visualType: "decision-tree",
    recipePattern: "comparison",
    stageLabels: ["Possible paths", "Selection criteria", "Best path"],
    avoidWhen: ["There is no selection or evaluation."],
    exampleConcepts: ["Research strategy", "Route planning", "Model selection"],
    tags: ["possibility", "selection", "path"],
  }),
  createPattern({
    id: "weak-signal-strong-signal",
    name: "Weak Signal -> Strong Signal",
    shortDescription: "A small pattern becomes visible or important.",
    deepPurpose: "Teaches attention to early signals before they become obvious.",
    category: "learning",
    keywords: ["weak", "strong", "signal", "amplify", "pattern", "detect"],
    atomsUsed: ["signal", "uncertainty", "flow", "human-understanding"],
    visualType: "transformation",
    recipePattern: "signal-decomposition",
    stageLabels: ["Weak signal", "Amplification", "Strong signal"],
    flowMaterial: "information",
    avoidWhen: ["The signal is already obvious at the beginning."],
    exampleConcepts: ["Early disease detection", "Market trend spotting", "Sensor data"],
    tags: ["signal", "amplification", "attention"],
  }),
  createPattern({
    id: "local-action-global-impact",
    name: "Local Action -> Global Impact",
    shortDescription: "One small action scales into larger world change.",
    deepPurpose: "Links personal or local action to system-level consequences.",
    category: "scale",
    keywords: ["local", "global", "impact", "scale", "action", "world"],
    atomsUsed: ["node", "flow", "system", "effect"],
    visualType: "network",
    recipePattern: "network-propagation",
    stageLabels: ["Local action", "Scaling network", "Global impact"],
    flowMaterial: "information",
    avoidWhen: ["The action does not propagate or scale."],
    exampleConcepts: ["Global problem solving", "Citizen science", "Open-source collaboration"],
    tags: ["local", "global", "impact"],
  }),
] as const satisfies readonly VisualPattern[];

export type OfficialVisualPattern = (typeof visualPatterns)[number];
