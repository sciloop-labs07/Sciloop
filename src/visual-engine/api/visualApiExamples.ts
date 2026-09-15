import type { VisualApiInput } from "./visualApi.types";

export const visualApiExamples: Array<{ label: string; input: VisualApiInput }> = [
  { label: "Fourier Transform", input: { rawText: "Explain Fourier Transform visually", sourceType: "concept", targetAudience: "beginner" } },
  { label: "Gravity", input: { rawText: "Show how gravity creates invisible field influence", sourceType: "concept", targetAudience: "beginner" } },
  { label: "Innovation news", input: { rawText: "Turn a battery discovery into a clear visual explanation", sourceType: "news", targetAudience: "intermediate" } },
];
