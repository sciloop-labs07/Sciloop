import {
  listAllPatternIds,
} from "@/src/visual-engine/patterns";
import { visualEngineIds } from "@/src/visual-engine/engines";

import type { AIVisualTranslatorInput } from "./aiVisualTranslator.types";

export function buildVisualRecipeSystemPrompt() {
  return [
    "You are the SciLoop AI Visual Translator.",
    "AI is not the visual engine. AI translates ideas into structured SciLoop Visual Recipes.",
    "SciLoop owns the visual language, pattern memory, engine router, and renderer.",
    "Return structured JSON only. Do not return SVG, Canvas code, image prompts, or random visual art directions.",
  ].join("\n");
}

export function buildVisualRecipeJsonInstruction() {
  return [
    "Output JSON with recipe fields only.",
    "Use SciLoop visual atoms, existing visual patterns, existing engine ids, fallback, explanation layers, and validation-friendly object references.",
    "Do not invent unsupported renderers, engines, atoms, or direct code.",
  ].join("\n");
}

export function buildPatternSelectionInstruction() {
  return `Choose one existing visual pattern id only: ${listAllPatternIds().join(", ")}.`;
}

export function buildEngineSelectionInstruction() {
  return `Choose one existing engine id only: ${visualEngineIds.join(", ")}. Include fallback engines.`;
}

export function buildGuardrailInstruction() {
  return [
    "No random SVG code.",
    "No random Canvas code.",
    "No direct image generation as recipe.",
    "No frontend API keys.",
    "No WebGPU without fallback.",
    "No huge object counts.",
    "Every relation must reference existing object ids.",
  ].join("\n");
}

export function buildVisualRecipeUserPrompt(input: AIVisualTranslatorInput) {
  return [
    `Topic: ${input.topic ?? "not provided"}`,
    `Raw text: ${input.rawText}`,
    `Audience: ${input.targetAudience ?? "general"}`,
    `Difficulty: ${input.difficulty ?? "beginner"}`,
    `Preferred pattern: ${input.preferredPatternId ?? "none"}`,
    `Preferred visual type: ${input.preferredVisualType ?? "none"}`,
    `Preferred engine: ${input.preferredEngine ?? "none"}`,
    `Constraints: ${(input.constraints ?? []).join("; ") || "none"}`,
  ].join("\n");
}

export function buildFullVisualRecipePrompt(input: AIVisualTranslatorInput) {
  return [
    buildVisualRecipeSystemPrompt(),
    buildVisualRecipeJsonInstruction(),
    buildPatternSelectionInstruction(),
    buildEngineSelectionInstruction(),
    buildGuardrailInstruction(),
    buildVisualRecipeUserPrompt(input),
  ].join("\n\n");
}
