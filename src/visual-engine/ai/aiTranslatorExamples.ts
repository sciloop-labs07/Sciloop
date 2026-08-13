import type { AIVisualTranslatorInput } from "./aiVisualTranslator.types";
import { translateWithMockAI } from "./aiVisualTranslator";

export const aiTranslatorExampleInputs: Array<{
  label: string;
  input: AIVisualTranslatorInput;
  expected: string;
}> = [
  {
    label: "Fourier Transform",
    input: { rawText: "Explain Fourier Transform visually", sourceType: "concept", targetAudience: "student" },
    expected: "Pattern: Signal Decomposition. Engine: svg-motion primary, canvas-2d fallback or enhancement.",
  },
  {
    label: "Gravity",
    input: { rawText: "Explain gravity visually", sourceType: "concept", targetAudience: "student" },
    expected: "Pattern: Field Influence. Engine: svg-motion primary with three-r3f as future upgrade note.",
  },
  {
    label: "Heat Energy",
    input: { rawText: "Explain how heat can become useful energy", sourceType: "concept", targetAudience: "student" },
    expected: "Pattern: Random -> Organized / Energy Flow. Engine: canvas-2d primary, svg-motion fallback.",
  },
  {
    label: "Global Problem Solving",
    input: { rawText: "Explain global problem solving through SciLoop", sourceType: "concept", targetAudience: "builder" },
    expected: "Pattern: Local Action -> Global Impact / Network Growth. Engine: svg-motion primary, maplibre future upgrade.",
  },
  {
    label: "Innovation News",
    input: { rawText: "Convert latest innovation news into visual understanding", sourceType: "news", targetAudience: "general" },
    expected: "Pattern: Innovation Pipeline / Compression of Complexity. Engine: react-tailwind + svg-motion.",
  },
];

export const aiTranslatorExampleOutputs = aiTranslatorExampleInputs.map((example) => ({
  ...example,
  output: translateWithMockAI(example.input),
}));
