export type CurrentDirection = -1 | 0 | 1;
export type MagnetDirection = -1 | 1;

export interface InductionSimulationState {
  magnetPosition: number;
  magnetVelocity: number;
  loopPosition: number;
  magneticFlux: number;
  fluxChangeRate: number;
  inducedEmf: number;
  currentDirection: CurrentDirection;
  time: number;
  paused: boolean;
  speedMultiplier: number;
  magnetDirection: MagnetDirection;
  motionAmount: number;
}

export interface InductionSimulationInput {
  paused?: boolean;
  speedMultiplier?: number;
  magnetDirection?: MagnetDirection;
  motionAmount?: number;
}

export const INDUCTION_LIMITS = {
  maxPosition: 2.4,
  maxVelocity: 2,
  maxFlux: 1,
  maxFluxChangeRate: 4,
  maxEmf: 4,
  maxSpeedMultiplier: 2,
  maxMotionAmount: 1,
} as const;

const DEFAULTS = {
  magnetPosition: -1.35,
  loopPosition: 0,
  motionAmount: 0.55,
  magnetDirection: 1 as MagnetDirection,
  speedMultiplier: 1,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const finite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

function fluxAt(position: number, loopPosition: number) {
  const distance = position - loopPosition;
  return clamp(1 / (1 + distance * distance), 0, INDUCTION_LIMITS.maxFlux);
}

export function createInitialInductionState(): InductionSimulationState {
  const magneticFlux = fluxAt(DEFAULTS.magnetPosition, DEFAULTS.loopPosition);
  return {
    magnetPosition: DEFAULTS.magnetPosition,
    magnetVelocity: DEFAULTS.magnetDirection * DEFAULTS.motionAmount,
    loopPosition: DEFAULTS.loopPosition,
    magneticFlux,
    fluxChangeRate: 0,
    inducedEmf: 0,
    currentDirection: 0,
    time: 0,
    paused: false,
    speedMultiplier: DEFAULTS.speedMultiplier,
    magnetDirection: DEFAULTS.magnetDirection,
    motionAmount: DEFAULTS.motionAmount,
  };
}

export function resetInductionSimulation(): InductionSimulationState {
  return createInitialInductionState();
}

export function setInductionInput(
  state: InductionSimulationState,
  input: InductionSimulationInput,
): InductionSimulationState {
  const nextDirection = input.magnetDirection ?? state.magnetDirection;
  const nextMotion = clamp(finite(input.motionAmount ?? state.motionAmount, state.motionAmount), 0, INDUCTION_LIMITS.maxMotionAmount);
  const nextSpeed = clamp(finite(input.speedMultiplier ?? state.speedMultiplier, state.speedMultiplier), 0.25, INDUCTION_LIMITS.maxSpeedMultiplier);
  return {
    ...state,
    paused: input.paused ?? state.paused,
    speedMultiplier: nextSpeed,
    magnetDirection: nextDirection,
    motionAmount: nextMotion,
    magnetVelocity: clamp(nextDirection * nextMotion, -INDUCTION_LIMITS.maxVelocity, INDUCTION_LIMITS.maxVelocity),
  };
}

export function stepInductionSimulation(state: InductionSimulationState, deltaSeconds: number): InductionSimulationState {
  const dt = clamp(finite(deltaSeconds, 0), 0, 0.05);
  if (state.paused || dt === 0) return state;

  const velocity = clamp(state.magnetVelocity, -INDUCTION_LIMITS.maxVelocity, INDUCTION_LIMITS.maxVelocity);
  const nextPosition = clamp(state.magnetPosition + velocity * state.speedMultiplier * dt, -INDUCTION_LIMITS.maxPosition, INDUCTION_LIMITS.maxPosition);
  const nextFlux = fluxAt(nextPosition, state.loopPosition);
  const fluxChangeRate = clamp((nextFlux - state.magneticFlux) / dt, -INDUCTION_LIMITS.maxFluxChangeRate, INDUCTION_LIMITS.maxFluxChangeRate);
  const inducedEmf = clamp(-fluxChangeRate, -INDUCTION_LIMITS.maxEmf, INDUCTION_LIMITS.maxEmf);
  const epsilon = 0.00001;
  const currentDirection: CurrentDirection = inducedEmf > epsilon ? 1 : inducedEmf < -epsilon ? -1 : 0;

  return {
    ...state,
    magnetPosition: nextPosition,
    magnetVelocity: velocity,
    magneticFlux: nextFlux,
    fluxChangeRate,
    inducedEmf,
    currentDirection,
    time: state.time + dt * state.speedMultiplier,
  };
}
