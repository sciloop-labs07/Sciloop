import React, { useMemo, useState } from "react";

const defaultControls = {
  simulationType: "ecosystem",
  gravity: 9.8,
  speed: 1.2,
  population: 34,
  energy: 62,
  temperature: 24
};

function buildSimulationCommand(controls) {
  return {
    source: "SciLoop",
    target: "Unity",
    version: "1.0",
    simulationType: controls.simulationType,
    entities: [
      {
        id: "ai_agents",
        type: "agent",
        name: "AI Agent",
        count: Math.round(controls.population),
        energy: Math.round(controls.energy),
        speed: Number(controls.speed),
        behavior: ["wander", "seek_energy", "avoid_walls"]
      },
      {
        id: "energy_particles",
        type: "resource",
        name: "Energy Particle",
        count: Math.max(4, Math.round(controls.population / 4)),
        energyValue: Math.max(8, Math.round(controls.energy / 3))
      }
    ],
    variables: {
      gravity: Number(controls.gravity),
      speed: Number(controls.speed),
      population: Math.round(controls.population),
      energy: Math.round(controls.energy),
      temperature: Math.round(controls.temperature)
    },
    causalRelations: [
      { from: "energyParticles", to: "averageEnergy", relation: "agents recover energy when they reach a particle" },
      { from: "population", to: "collisionCount", relation: "more agents create more collisions" },
      { from: "temperature", to: "stabilityScore", relation: "temperature far from the comfort zone lowers stability" },
      { from: "gravity", to: "verticalSettling", relation: "higher gravity pulls the simulation closer to the floor plane" }
    ],
    visualModel: {
      renderer: "unity-webgl-or-canvas-fallback",
      scene: "dark scientific AI sandbox",
      camera: "orbit",
      effects: ["agent trails", "energy glow", "collision flashes", "temperature haze"]
    },
    controls,
    resultsRequest: {
      aliveAgents: true,
      averageEnergy: true,
      collisionCount: true,
      stabilityScore: true
    },
    bridgeMeta: {
      protocol: "sciloop-unity-ai-sandbox",
      version: "0.2",
      targetObject: "SciLoopUnityBridge",
      targetMethod: "LoadSimulation",
      generatedAt: new Date().toISOString()
    }
  };
}

export default function UnityAISandbox({ unityInstance }) {
  const [controls, setControls] = useState(defaultControls);
  const [results, setResults] = useState({
    aliveAgents: defaultControls.population,
    averageEnergy: defaultControls.energy,
    collisionCount: 0,
    stabilityScore: 0.78
  });

  const command = useMemo(() => buildSimulationCommand(controls), [controls]);

  function updateControl(key, value) {
    setControls((current) => ({
      ...current,
      [key]: key === "simulationType" ? value : Number(value)
    }));
  }

  function sendToUnity() {
    if (unityInstance && typeof unityInstance.SendMessage === "function") {
      unityInstance.SendMessage("SciLoopUnityBridge", "LoadSimulation", JSON.stringify(command));
      return;
    }
    setResults({
      aliveAgents: Math.round(controls.population),
      averageEnergy: Math.round(controls.energy),
      collisionCount: Math.round(controls.population * controls.speed * 0.05),
      stabilityScore: Math.max(0.05, Math.min(0.99, 0.92 - Math.abs(controls.temperature - 24) / 160))
    });
  }

  function resetSimulation() {
    if (unityInstance && typeof unityInstance.SendMessage === "function") {
      unityInstance.SendMessage("SciLoopUnityBridge", "ResetSimulation", "");
    }
    setControls(defaultControls);
    setResults({
      aliveAgents: defaultControls.population,
      averageEnergy: defaultControls.energy,
      collisionCount: 0,
      stabilityScore: 0.78
    });
  }

  return (
    <section className="unity-ai-sandbox">
      <header>
        <p>Unity WebGL AI simulation</p>
        <h2>Unity AI Sandbox</h2>
        <p>SciLoop creates the intelligence model. Unity visualizes and simulates it. JSON connects both.</p>
      </header>

      <label>
        Simulation type
        <select value={controls.simulationType} onChange={(event) => updateControl("simulationType", event.target.value)}>
          <option value="ecosystem">AI ecosystem</option>
          <option value="molecular">Molecular swarm</option>
          <option value="climate">Climate pressure</option>
          <option value="population">Population dynamics</option>
          <option value="neural">Neural signal field</option>
        </select>
      </label>

      {["gravity", "speed", "population", "energy", "temperature"].map((key) => (
        <label key={key}>
          {key}
          <input
            type="range"
            min={key === "temperature" ? -20 : key === "speed" ? 0.1 : 0}
            max={key === "population" ? 120 : key === "temperature" ? 80 : key === "speed" ? 4 : key === "gravity" ? 20 : 100}
            step={key === "speed" || key === "gravity" ? 0.1 : 1}
            value={controls[key]}
            onChange={(event) => updateControl(key, event.target.value)}
          />
          <span>{controls[key]}</span>
        </label>
      ))}

      <div>
        <button type="button" onClick={sendToUnity}>Start / Send to Unity</button>
        <button type="button" onClick={resetSimulation}>Reset</button>
      </div>

      <div>
        <strong>Alive agents:</strong> {results.aliveAgents}
        <strong> Average energy:</strong> {Math.round(results.averageEnergy)}%
        <strong> Collisions:</strong> {results.collisionCount}
        <strong> Stability:</strong> {Math.round(results.stabilityScore * 100)}%
      </div>

      <pre>{JSON.stringify(command, null, 2)}</pre>
    </section>
  );
}
