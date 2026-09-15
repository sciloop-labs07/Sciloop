// @ts-expect-error Node's strip-types runner resolves this explicit .ts extension.
import { createInitialInductionState, resetInductionSimulation, setInductionInput, stepInductionSimulation } from "./induction-simulation.ts";

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};
const approx = (a: number, b: number, tolerance = 1e-9) => Math.abs(a - b) <= tolerance;

export function runInductionSimulationTests() {
  const initial = createInitialInductionState();
  assert(initial.time === 0 && initial.inducedEmf === 0, "initial state is deterministic");
  assert(resetInductionSimulation().magnetPosition === initial.magnetPosition, "reset returns initial state");

  const stationary = setInductionInput(initial, { motionAmount: 0 });
  const stationaryStep = stepInductionSimulation(stationary, 1 / 60);
  assert(Math.abs(stationaryStep.inducedEmf) < 1e-9, "stationary magnet has no induced emf");

  const slow = stepInductionSimulation(setInductionInput(initial, { motionAmount: 0.2 }), 1 / 60);
  const fast = stepInductionSimulation(setInductionInput(initial, { motionAmount: 0.8 }), 1 / 60);
  assert(Math.abs(fast.fluxChangeRate) > Math.abs(slow.fluxChangeRate), "faster motion changes flux more quickly");

  const forward = stepInductionSimulation(setInductionInput(initial, { motionAmount: 0.6, magnetDirection: 1 }), 1 / 60);
  const reverse = stepInductionSimulation(setInductionInput(initial, { motionAmount: 0.6, magnetDirection: -1 }), 1 / 60);
  assert(forward.currentDirection === -reverse.currentDirection, "reversing velocity reverses current direction");
  assert(forward.currentDirection === (forward.inducedEmf > 0 ? 1 : -1), "current direction follows emf sign");

  const bounded = stepInductionSimulation(setInductionInput(initial, { motionAmount: 99, speedMultiplier: 99 }), 99);
  assert(Number.isFinite(bounded.inducedEmf) && Math.abs(bounded.inducedEmf) <= 4, "values remain bounded");
  const deterministicA = stepInductionSimulation(initial, 0.016);
  const deterministicB = stepInductionSimulation(initial, 0.016);
  assert(approx(deterministicA.magneticFlux, deterministicB.magneticFlux), "stepping is deterministic");
  assert(bounded.magneticFlux >= 0 && bounded.fluxChangeRate === bounded.fluxChangeRate, "measurements are valid");
  return true;
}
