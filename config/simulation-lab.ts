import type { SimulationGraphicsMode, SimulationQuality } from "@/lib/types";

export const simulationLabRuntimeConfig: {
  defaultGraphicsMode: SimulationGraphicsMode;
  defaultQuality: SimulationQuality;
} = {
  defaultGraphicsMode: "browser",
  defaultQuality: "auto",
};

export const simulationGraphicsModeLabels: Record<SimulationGraphicsMode, string> = {
  auto: "Auto",
  browser: "Browser",
};

export const simulationQualityLabels: Record<SimulationQuality, string> = {
  auto: "Auto",
  low: "Low",
  medium: "Medium",
  high: "High",
};
