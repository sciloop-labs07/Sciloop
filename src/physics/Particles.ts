import type { Vec2 } from "@/src/semantic/SemanticTypes";

export interface Particle {
  id: string;
  position: Vec2;
  velocity: Vec2;
  energy: number;
}
