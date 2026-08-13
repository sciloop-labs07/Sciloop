import type { VisualEngineV1DemoConcept, VisualEngineV1ModuleStatus, VisualEngineV1PipelineStep } from "./visualEngineV1.types";

export const SCILOOP_VISUAL_ENGINE_V1_NAME = "SciLoop Visual Engine V1";
export const SCILOOP_VISUAL_ENGINE_V1_TAGLINE = "Concept → Controlled Visual Recipe → Pattern → Correct Engine → Human Understanding → Feedback Evolution";
export const SCILOOP_VISUAL_ENGINE_V1_MEANING = "SciLoop Visual Engine V1 is the first version of a Visual Understanding Operating System.";

export const VISUAL_ENGINE_V1_PIPELINE: VisualEngineV1PipelineStep[] = [
  { id: "idea", title: "User Idea", description: "A topic, question, news item, concept, or problem enters SciLoop.", input: "Raw human thought", output: "Clean translator input", moduleId: "ai-translator" },
  { id: "translator", title: "AI Visual Translator", description: "Mock translation converts meaning into a structured visual recipe.", input: "User idea", output: "Visual Recipe", moduleId: "ai-translator" },
  { id: "recipe", title: "Visual Recipe", description: "Controlled layers, objects, flows, relations, explanations, and fallback.", input: "Meaning", output: "Structured visual instruction", moduleId: "visual-recipes" },
  { id: "pattern", title: "Visual Pattern", description: "A reusable explanation structure prevents random visual design.", input: "Recipe intention", output: "Reusable understanding structure", moduleId: "patterns" },
  { id: "engine", title: "Engine Router", description: "Chooses the smallest useful rendering technology and fallbacks.", input: "Recipe + pattern", output: "Primary + fallback engines", moduleId: "engine-router" },
  { id: "renderer", title: "Visual Renderer", description: "Renders a controlled visual explanation.", input: "Recipe + route", output: "Human-readable visual", moduleId: "renderer" },
  { id: "feedback", title: "Human Feedback", description: "Captures clarity, complexity, motion, usefulness, and improvement signals.", input: "Rendered visual", output: "Clarity signal", moduleId: "feedback" },
  { id: "memory", title: "Visual Memory", description: "Successful explanations become reusable knowledge.", input: "Feedback + successful recipe", output: "Visual intelligence", moduleId: "visual-memory" },
];

export const VISUAL_ENGINE_V1_DEMO_CONCEPTS: VisualEngineV1DemoConcept[] = [
  { id: "fourier-transform", title: "Fourier Transform", userPrompt: "Explain Fourier Transform visually", expectedPattern: "Signal Decomposition", expectedEngine: "svg-motion primary, canvas-2d fallback", explanationGoal: "Show how a mixed signal separates into simpler frequency components.", audience: "beginner", domain: "math" },
  { id: "gravity", title: "Gravity", userPrompt: "Explain gravity visually", expectedPattern: "Field Influence", expectedEngine: "svg-motion primary, three-r3f future upgrade", explanationGoal: "Show invisible field influence caused by mass.", audience: "beginner", domain: "physics" },
  { id: "heat-to-energy", title: "Heat to Organized Energy", userPrompt: "Explain how random heat motion can become useful energy", expectedPattern: "Random → Organized + Energy Flow", expectedEngine: "canvas-2d primary, svg-motion fallback", explanationGoal: "Show random particle motion becoming directed useful work.", audience: "beginner", domain: "energy" },
  { id: "global-problem-solving", title: "Global Problem Solving", userPrompt: "Explain how SciLoop can help people solve global problems visually", expectedPattern: "Local Action → Global Impact + Network Growth", expectedEngine: "svg-motion primary, maplibre future upgrade", explanationGoal: "Show local solutions scaling into global collaboration.", audience: "beginner", domain: "global-problems" },
  { id: "visual-understanding", title: "Random Information to Human Understanding", userPrompt: "Show how raw information becomes human understanding", expectedPattern: "Compression of Complexity", expectedEngine: "react-tailwind + svg-motion", explanationGoal: "Show noise becoming signal, then layered reality, then understanding.", audience: "kid", domain: "education" },
  { id: "innovation-news", title: "Innovation News to Visual Insight", userPrompt: "Convert innovation news into visual understanding", expectedPattern: "Innovation Pipeline", expectedEngine: "react-tailwind + svg-motion", explanationGoal: "Show observation, invention, product, impact, and future possibility.", audience: "beginner", domain: "innovation" },
];

export const VISUAL_ENGINE_V1_MODULES: VisualEngineV1ModuleStatus[] = [
  { id: "visual-language", name: "Visual Language Foundation", status: "ready", description: "Controlled visual atoms and semantics.", readyNow: true, demoMode: false, warnings: [] },
  { id: "visual-recipes", name: "Visual Recipe Schema", status: "ready", description: "Typed renderer-safe visual instructions.", readyNow: true, demoMode: false, warnings: [] },
  { id: "renderer", name: "Base Visual Recipe Renderer", status: "ready", description: "React, Tailwind, SVG, and safe fallback rendering.", readyNow: true, demoMode: false, warnings: [] },
  { id: "patterns", name: "Visual Pattern Library", status: "ready", description: "Reusable explanation intelligence.", readyNow: true, demoMode: false, warnings: [] },
  { id: "engine-router", name: "Engine Router", status: "ready", description: "Chooses correct rendering paths and fallbacks.", readyNow: true, demoMode: false, warnings: [] },
  { id: "tech-lab", name: "Visual Tech Frontier Lab", status: "demo-only", description: "Safe live comparisons and future placeholders.", readyNow: true, demoMode: true, warnings: ["Heavy engines are optional placeholders."] },
  { id: "ai-translator", name: "AI Visual Translator", status: "demo-only", description: "Mock translator creates controlled recipes.", readyNow: true, demoMode: true, warnings: ["Mock mode is default. No frontend API keys."], nextUpgrade: "Secure server-side AI provider" },
  { id: "feedback", name: "Feedback and Evolution", status: "ready", description: "Human clarity signals and suggestion-only evolution.", readyNow: true, demoMode: false, warnings: [] },
  { id: "feedback-storage", name: "Database-Ready Feedback Storage", status: "demo-only", description: "Local storage now, adapter boundary later.", readyNow: true, demoMode: true, warnings: ["No production database configured."], nextUpgrade: "Database-backed feedback storage" },
  { id: "visual-memory", name: "Visual Memory", status: "demo-only", description: "Successful explanations become reusable local memory.", readyNow: true, demoMode: true, warnings: ["Long-term cross-device memory needs a database."] },
  { id: "health-check", name: "Health Check", status: "ready", description: "Validates modules, recipes, fallbacks, storage, and memory.", readyNow: true, demoMode: false, warnings: [] },
];
