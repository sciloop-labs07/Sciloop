import type { SimulationSnapshot } from "@/src/simulation/SimulationEngine";

export interface Renderer {
  mount(target: HTMLElement): void;
  resize(): void;
  render(snapshot: SimulationSnapshot): void;
  destroy(): void;
}

export interface RenderSize {
  width: number;
  height: number;
  dpr: number;
}
