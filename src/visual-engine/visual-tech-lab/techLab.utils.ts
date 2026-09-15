import {
  getRecommendedEngine,
  type EngineRoutingResult,
} from "@/src/visual-engine/engines";

import { sharedTechLabConcept, visualTechDemos } from "./techLab.constants";
import type { VisualTechDemo, VisualTechId } from "./techLab.types";

export function getVisualTechDemo(techId: VisualTechId): VisualTechDemo | undefined {
  return visualTechDemos.find((demo) => demo.id === techId);
}

export function getReadyNowTechDemos() {
  return visualTechDemos.filter((demo) => demo.demoMode === "live");
}

export function getPlaceholderTechDemos() {
  return visualTechDemos.filter((demo) => demo.demoMode === "placeholder");
}

export function getTechStatusLabel(demo: VisualTechDemo) {
  switch (demo.demoStatus) {
    case "ready-now":
      return "Ready now";
    case "safe-fallback":
      return "Safe fallback";
    case "future-upgrade":
      return "Future upgrade";
    case "experimental":
      return "Experimental";
    case "heavy-dependency":
      return "Heavy dependency";
  }
}

export function getRecommendedUsageLabel(demo: VisualTechDemo) {
  switch (demo.recommendedForSciLoop) {
    case "use-now":
      return "Use now";
    case "use-as-fallback":
      return "Use as fallback";
    case "evaluate-later":
      return "Evaluate later";
    case "frontier-only":
      return "Frontier only";
  }
}

export function getRouterResultForTech(demo: VisualTechDemo): EngineRoutingResult {
  return getRecommendedEngine({
    conceptText: `${sharedTechLabConcept} ${demo.routerConceptHint}`,
    preferredEngine: demo.engineId,
    complexity: demo.performanceLevel === "frontier" ? "frontier" : demo.performanceLevel,
  });
}

export function sortTechDemosForLab(demos: VisualTechDemo[]) {
  const rank = { live: 0, placeholder: 1 };
  return [...demos].sort((a, b) => rank[a.demoMode] - rank[b.demoMode] || a.name.localeCompare(b.name));
}
