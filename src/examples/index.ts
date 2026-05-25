import { economicInflationDemo } from "./economicInflation";
import { gravityWellDemo } from "./gravityWell";
import { neuralLearningDemo } from "./neuralLearning";
import { photosynthesisDemo } from "./photosynthesis";

export const demoDefinitions = [
  gravityWellDemo,
  photosynthesisDemo,
  neuralLearningDemo,
  economicInflationDemo,
];

export type { DemoDefinition } from "@/src/semantic/examples";
