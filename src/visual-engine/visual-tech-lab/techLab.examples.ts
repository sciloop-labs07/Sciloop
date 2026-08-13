import { sharedTechLabConcept, visualTechDemos } from "./techLab.constants";
import { getRouterResultForTech } from "./techLab.utils";

export const visualTechLabExamples = visualTechDemos.map((demo) => ({
  techId: demo.id,
  name: demo.name,
  sharedConcept: sharedTechLabConcept,
  live: demo.demoMode === "live",
  routerResult: getRouterResultForTech(demo),
}));
