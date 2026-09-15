// @ts-expect-error Node's strip-types runner resolves the explicit .ts extension.
import { runInductionSimulationTests } from "../src/physics-visual-language/simulations/induction-simulation.test.ts";

runInductionSimulationTests();
console.log("Induction simulation tests passed.");
