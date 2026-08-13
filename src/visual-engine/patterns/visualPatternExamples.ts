import type { VisualRecipe } from "@/src/visual-engine/foundation";

import {
  createRecipeFromPattern,
  createRecipeFromVisualPattern,
} from "./visualPatternFactory";
import { getPatternById } from "./visualPatternRegistry";
import type { VisualPatternId } from "./visualPattern.types";
import { mergeCompatiblePatterns } from "./visualPatternUtils";

function mustGetPattern(patternId: VisualPatternId) {
  const pattern = getPatternById(patternId);
  if (!pattern) {
    throw new Error(`Missing example visual pattern: ${patternId}`);
  }
  return pattern;
}

export const fourierTransformPatternRecipe = createRecipeFromPattern("signal-decomposition", "Fourier Transform");

export const heatToOrganizedEnergyPatternRecipe = createRecipeFromVisualPattern(
  mergeCompatiblePatterns([mustGetPattern("random-to-organized"), mustGetPattern("energy-flow")]),
  "Heat to Organized Energy",
);

export const gravityPatternRecipe = createRecipeFromPattern("field-influence", "Gravity");

export const globalProblemSolvingPatternRecipe = createRecipeFromVisualPattern(
  mergeCompatiblePatterns([mustGetPattern("local-action-global-impact"), mustGetPattern("network-growth")]),
  "Global Problem Solving",
);

export const sciloopVisualUnderstandingPatternRecipe = createRecipeFromPattern(
  "compression-of-complexity",
  "SciLoop Visual Understanding",
);

export const visualPatternExampleRecipes = [
  fourierTransformPatternRecipe,
  heatToOrganizedEnergyPatternRecipe,
  gravityPatternRecipe,
  globalProblemSolvingPatternRecipe,
  sciloopVisualUnderstandingPatternRecipe,
] as const satisfies readonly VisualRecipe[];
