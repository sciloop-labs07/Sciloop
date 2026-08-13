import {
  createFallback,
  createFlow,
  createLayer,
  createObject,
  createRelation,
  createTransformation,
  createVisualRecipe,
} from "./visualRecipe.factory";
import type { VisualRecipe } from "./visualRecipe.types";

export const randomInformationUnderstandingRecipe = createVisualRecipe({
  id: "recipe-random-information-human-understanding",
  title: "Random information becoming human understanding",
  concept: "Random information becomes useful when noise is filtered into signal, organized, and transformed into understanding.",
  summary: "A transformation recipe showing scattered input becoming structured meaning.",
  difficulty: "beginner",
  targetAudience: "student",
  visualType: "transformation",
  pattern: "random-to-organized",
  atomsUsed: ["noise", "signal", "flow", "transformation", "layer", "human-understanding"],
  layers: [
    createLayer({
      id: "noise-layer",
      title: "Noise layer",
      description: "Unfiltered input contains many distracting fragments.",
      depth: 0,
      atomsUsed: ["noise", "layer"],
      visibleByDefault: true,
    }),
    createLayer({
      id: "signal-layer",
      title: "Signal layer",
      description: "Useful structure is extracted from noise.",
      depth: 1,
      atomsUsed: ["signal", "flow"],
      visibleByDefault: true,
    }),
    createLayer({
      id: "understanding-layer",
      title: "Understanding layer",
      description: "Signal becomes a stable mental model.",
      depth: 2,
      atomsUsed: ["human-understanding", "transformation"],
      visibleByDefault: true,
    }),
  ],
  objects: [
    createObject({
      id: "random-input",
      label: "Random information",
      atom: "noise",
      layerId: "noise-layer",
      description: "Raw data before filtering.",
      position: { x: 0.14, y: 0.5 },
      certainty: "unknown",
      importance: 0.55,
    }),
    createObject({
      id: "useful-signal",
      label: "Useful signal",
      atom: "signal",
      layerId: "signal-layer",
      description: "Relevant pattern detected inside the noise.",
      position: { x: 0.48, y: 0.46 },
      certainty: "inferred",
      importance: 0.82,
    }),
    createObject({
      id: "human-understanding",
      label: "Human understanding",
      atom: "human-understanding",
      layerId: "understanding-layer",
      description: "A concept the learner can now use.",
      position: { x: 0.84, y: 0.5 },
      certainty: "known",
      importance: 1,
    }),
  ],
  relations: [
    createRelation({
      id: "filter-relation",
      fromObjectId: "random-input",
      toObjectId: "useful-signal",
      atom: "edge",
      label: "filter",
      description: "Filtering separates signal from noise.",
      strength: 0.68,
      certainty: "inferred",
    }),
    createRelation({
      id: "meaning-relation",
      fromObjectId: "useful-signal",
      toObjectId: "human-understanding",
      atom: "effect",
      label: "meaning forms",
      description: "Organized signal produces understanding.",
      strength: 0.88,
      certainty: "known",
    }),
  ],
  flows: [
    createFlow({
      id: "information-flow",
      atom: "flow",
      source: "random-input",
      target: "human-understanding",
      material: "information",
      rate: 0.72,
      label: "information becomes meaning",
    }),
  ],
  transformations: [
    createTransformation({
      id: "noise-to-understanding",
      atom: "transformation",
      before: "random-input",
      process: "useful-signal",
      after: "human-understanding",
      label: "random to organized",
    }),
  ],
  feedbackLoops: [],
  timeline: {
    id: "understanding-timeline",
    stages: [
      { id: "raw", label: "Raw", description: "Input is noisy.", relatedObjectIds: ["random-input"] },
      { id: "filtered", label: "Filtered", description: "Signal appears.", relatedObjectIds: ["useful-signal"] },
      { id: "understood", label: "Understood", description: "Meaning stabilizes.", relatedObjectIds: ["human-understanding"] },
    ],
  },
  interactions: [],
  motion: [
    {
      id: "compress-noise-motion",
      targetId: "random-input",
      meaning: "Compression simplifies complex reality.",
      motionType: "compress",
      speed: 0.55,
      intensity: 0.72,
    },
  ],
  engineRecommendation: {
    primary: "svg-motion",
    alternatives: ["canvas-2d"],
    reason: "SVG motion is enough for the first controlled transformation; Canvas can add richer particle filtering later.",
  },
  explanation: {
    simple: "Noise becomes useful when a signal is filtered and organized.",
    detailed: "The recipe teaches that understanding is not raw information. It is structured signal extracted from noisy input.",
    keyTakeaways: ["Noise is unstructured.", "Signal is useful structure.", "Understanding is organized signal."],
    visualReadingOrder: ["Random information", "Useful signal", "Human understanding"],
  },
  fallback: createFallback({
    title: "Three-step concept map",
    description: "Show three labeled cards connected by arrows.",
    safeVisualType: "concept-map",
    messageForUser: "Read left to right: noise, signal, understanding.",
  }),
  assessment: {
    checksUnderstanding: true,
    expectedUserInsight: "The learner sees why filtering matters before understanding appears.",
    questions: ["What changes noise into signal?", "Why is raw information not enough?"],
    successCriteria: ["User can identify noise, signal, and understanding."],
  },
  tags: ["understanding", "signal", "noise", "learning"],
});

export const fourierTransformRecipe = createVisualRecipe({
  id: "recipe-fourier-transform",
  title: "Fourier Transform",
  concept: "A mixed signal can be decomposed into simpler wave components and understood as a frequency spectrum.",
  summary: "A signal decomposition recipe that turns one complex wave into readable component waves.",
  difficulty: "intermediate",
  targetAudience: "student",
  visualType: "signal-decomposition",
  pattern: "signal-decomposition",
  atomsUsed: ["signal", "pattern", "transformation", "layer", "information", "human-understanding"],
  layers: [
    createLayer({ id: "mixed-signal", title: "Mixed signal", description: "The signal appears complex in time.", depth: 0, atomsUsed: ["signal"], visibleByDefault: true }),
    createLayer({ id: "wave-components", title: "Wave components", description: "The complex signal separates into simple waves.", depth: 1, atomsUsed: ["pattern", "signal"], visibleByDefault: true }),
    createLayer({ id: "frequency-spectrum", title: "Frequency spectrum", description: "Each frequency receives a visible strength.", depth: 2, atomsUsed: ["information", "scale"], visibleByDefault: true }),
    createLayer({ id: "fourier-understanding", title: "Human understanding", description: "The learner sees hidden structure inside a noisy-looking signal.", depth: 3, atomsUsed: ["human-understanding"], visibleByDefault: true }),
  ],
  objects: [
    createObject({ id: "complex-wave", label: "Complex wave", atom: "signal", layerId: "mixed-signal", description: "The original mixed signal.", position: { x: 0.16, y: 0.48 }, certainty: "known", importance: 0.9 }),
    createObject({ id: "component-waves", label: "Component waves", atom: "pattern", layerId: "wave-components", description: "Simple waves hidden inside the signal.", position: { x: 0.44, y: 0.42 }, certainty: "inferred", importance: 0.86 }),
    createObject({ id: "spectrum-bars", label: "Frequency spectrum", atom: "information", layerId: "frequency-spectrum", description: "Strength of each frequency.", position: { x: 0.68, y: 0.5 }, certainty: "known", importance: 0.88 }),
    createObject({ id: "frequency-insight", label: "Frequency insight", atom: "human-understanding", layerId: "fourier-understanding", description: "Understanding signal structure through frequency.", position: { x: 0.88, y: 0.48 }, certainty: "known", importance: 1 }),
  ],
  relations: [
    createRelation({ id: "decompose-relation", fromObjectId: "complex-wave", toObjectId: "component-waves", atom: "edge", label: "decompose", strength: 0.92, certainty: "known" }),
    createRelation({ id: "spectrum-relation", fromObjectId: "component-waves", toObjectId: "spectrum-bars", atom: "effect", label: "measure frequency", strength: 0.86, certainty: "known" }),
  ],
  flows: [
    createFlow({ id: "signal-decomposition-flow", atom: "flow", source: "complex-wave", target: "spectrum-bars", material: "information", rate: 0.76, label: "signal structure revealed" }),
  ],
  transformations: [
    createTransformation({ id: "wave-to-spectrum", atom: "transformation", before: "complex-wave", process: "component-waves", after: "spectrum-bars", label: "time signal to frequency view" }),
  ],
  feedbackLoops: [],
  timeline: {
    id: "fourier-timeline",
    stages: [
      { id: "mixed", label: "Mixed", description: "See the complex signal.", relatedObjectIds: ["complex-wave"] },
      { id: "split", label: "Split", description: "Separate into component waves.", relatedObjectIds: ["component-waves"] },
      { id: "read", label: "Read", description: "Read the spectrum.", relatedObjectIds: ["spectrum-bars", "frequency-insight"] },
    ],
  },
  interactions: [],
  motion: [
    { id: "split-wave-motion", targetId: "complex-wave", meaning: "Split path shows hidden components.", motionType: "split", speed: 0.62, intensity: 0.8 },
  ],
  engineRecommendation: {
    primary: "svg-motion",
    alternatives: ["canvas-2d"],
    reason: "SVG motion can clearly split waves for teaching; Canvas can animate continuous wave sampling later.",
  },
  explanation: {
    simple: "Fourier Transform shows the simple waves inside a complex signal.",
    detailed: "The recipe moves from a mixed time-domain signal to component waves and then to a frequency spectrum.",
    keyTakeaways: ["Complex signals can hide simple waves.", "Frequency view reveals structure.", "Spectrum bars show component strength."],
    visualReadingOrder: ["Complex wave", "Component waves", "Frequency spectrum", "Frequency insight"],
  },
  fallback: createFallback({ title: "Wave decomposition cards", description: "Show a complex wave, three component waves, and spectrum bars.", safeVisualType: "comparison", messageForUser: "Compare the mixed wave with the simpler waves that compose it." }),
  assessment: {
    checksUnderstanding: true,
    expectedUserInsight: "The learner understands decomposition from mixed signal to frequency spectrum.",
    questions: ["What does the spectrum reveal?", "Why is the original signal hard to read directly?"],
    successCriteria: ["User can explain that a complex signal can be represented by simpler waves."],
  },
  tags: ["math", "signal", "fourier", "decomposition"],
});

export const heatToOrganizedEnergyRecipe = createVisualRecipe({
  id: "recipe-heat-to-organized-energy",
  title: "Heat to organized energy",
  concept: "Random particle motion can be aligned by a mechanism into directed energy flow that performs useful work.",
  summary: "A flow-system recipe showing random heat becoming organized work.",
  difficulty: "intermediate",
  targetAudience: "student",
  visualType: "flow-system",
  pattern: "energy-flow",
  atomsUsed: ["noise", "energy", "flow", "transformation", "system", "effect"],
  layers: [
    createLayer({ id: "random-particle-motion", title: "Random particle motion", description: "Heat begins as disordered particle movement.", depth: 0, atomsUsed: ["noise", "energy"], visibleByDefault: true }),
    createLayer({ id: "alignment-mechanism", title: "Alignment mechanism", description: "A system channels random motion.", depth: 1, atomsUsed: ["system", "transformation"], visibleByDefault: true }),
    createLayer({ id: "directed-energy-flow", title: "Directed energy flow", description: "Energy gains direction.", depth: 2, atomsUsed: ["flow", "energy"], visibleByDefault: true }),
    createLayer({ id: "useful-work", title: "Useful work", description: "Directed energy produces a visible result.", depth: 3, atomsUsed: ["effect"], visibleByDefault: true }),
  ],
  objects: [
    createObject({ id: "random-heat", label: "Random heat", atom: "noise", layerId: "random-particle-motion", description: "Particles moving in many directions.", position: { x: 0.14, y: 0.55 }, certainty: "known", importance: 0.75 }),
    createObject({ id: "alignment-engine", label: "Alignment mechanism", atom: "system", layerId: "alignment-mechanism", description: "A device or process channels energy.", position: { x: 0.42, y: 0.48 }, certainty: "known", importance: 0.88 }),
    createObject({ id: "directed-flow", label: "Directed energy flow", atom: "flow", layerId: "directed-energy-flow", description: "Energy moving in a useful direction.", position: { x: 0.66, y: 0.48 }, certainty: "known", importance: 0.92 }),
    createObject({ id: "useful-work-output", label: "Useful work", atom: "effect", layerId: "useful-work", description: "Motion, electricity, lifting, or another useful output.", position: { x: 0.86, y: 0.5 }, certainty: "known", importance: 1 }),
  ],
  relations: [
    createRelation({ id: "heat-to-engine", fromObjectId: "random-heat", toObjectId: "alignment-engine", atom: "cause", label: "input heat", strength: 0.74, certainty: "known" }),
    createRelation({ id: "engine-to-flow", fromObjectId: "alignment-engine", toObjectId: "directed-flow", atom: "edge", label: "aligns", strength: 0.82, certainty: "known" }),
    createRelation({ id: "flow-to-work", fromObjectId: "directed-flow", toObjectId: "useful-work-output", atom: "effect", label: "does work", strength: 0.86, certainty: "known" }),
  ],
  flows: [
    createFlow({ id: "energy-flow", atom: "flow", source: "random-heat", target: "useful-work-output", material: "energy", rate: 0.78, label: "heat becomes useful work" }),
  ],
  transformations: [
    createTransformation({ id: "heat-to-work-transform", atom: "transformation", before: "random-heat", process: "alignment-engine", after: "useful-work-output", label: "random motion to organized work" }),
  ],
  feedbackLoops: [],
  timeline: {
    id: "heat-work-timeline",
    stages: [
      { id: "disorder", label: "Disorder", description: "Particles move randomly.", relatedObjectIds: ["random-heat"] },
      { id: "alignment", label: "Alignment", description: "A mechanism channels motion.", relatedObjectIds: ["alignment-engine"] },
      { id: "work", label: "Work", description: "Energy becomes useful output.", relatedObjectIds: ["directed-flow", "useful-work-output"] },
    ],
  },
  interactions: [],
  motion: [
    { id: "particle-alignment-motion", targetId: "random-heat", meaning: "Random movement becomes aligned movement.", motionType: "converge", speed: 0.7, intensity: 0.82 },
  ],
  engineRecommendation: {
    primary: "canvas-2d",
    alternatives: ["pixijs"],
    reason: "Canvas is best first for particle-like motion; PixiJS is only a later option if particle count grows.",
    avoid: ["three-r3f", "webgpu-experimental"],
  },
  explanation: {
    simple: "Useful work appears when random heat is organized into directed energy flow.",
    detailed: "The recipe shows heat as disorder first, then an alignment mechanism, then directed energy and useful output.",
    keyTakeaways: ["Heat is random motion.", "A mechanism can channel energy.", "Directed flow can do useful work."],
    visualReadingOrder: ["Random heat", "Alignment mechanism", "Directed energy flow", "Useful work"],
  },
  fallback: createFallback({ title: "Energy flow diagram", description: "Show heat, mechanism, directed flow, and work as four labeled steps.", safeVisualType: "flow-system", messageForUser: "Read left to right: random motion is organized into useful work." }),
  assessment: {
    checksUnderstanding: true,
    expectedUserInsight: "The learner understands why organized direction matters for useful energy.",
    questions: ["What changes random heat into useful work?", "Why does direction matter?"],
    successCriteria: ["User can identify random motion, alignment, directed flow, and output."],
  },
  tags: ["energy", "heat", "thermodynamics", "flow-system"],
});

export const visualRecipeExamples = [
  randomInformationUnderstandingRecipe,
  fourierTransformRecipe,
  heatToOrganizedEnergyRecipe,
] as const satisfies readonly VisualRecipe[];

