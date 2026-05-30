(function () {
  "use strict";

  const BRIDGE_VERSION = "0.2";
  const UNITY_OBJECT_NAME = "SciLoopUnityBridge";
  const UNITY_METHOD_NAME = "LoadSimulation";

  const state = {
    gravity: 9.8,
    speed: 1.2,
    population: 34,
    energy: 62,
    temperature: 24,
    simulationType: "ecosystem",
    frame: 0,
    collisionCount: 0,
    averageSpeed: 1.2,
    averageEnergy: 62,
    aliveAgents: 34,
    stabilityScore: 0.78,
    particles: [],
    resources: [],
    lastJson: null,
    canvasContext: null,
    animationId: null,
    unityAvailable: false
  };

  const sampleSimulation = {
    source: "SciLoop",
    target: "Unity",
    version: "1.0",
    simulationType: "ecosystem",
    entities: [
      {
        id: "ai_agents",
        type: "agent",
        name: "AI Agent",
        count: 34,
        energy: 62,
        speed: 1.2,
        behavior: ["wander", "seek_energy", "avoid_walls"]
      },
      {
        id: "energy_particles",
        type: "resource",
        name: "Energy Particle",
        count: 10,
        energyValue: 25
      },
      { id: "environment", type: "field", name: "Simulation Chamber", role: "gravity and temperature boundary" }
    ],
    variables: {
      gravity: 9.8,
      speed: 1.2,
      population: 34,
      energy: 62,
      temperature: 24
    },
    causalRelations: [
      { from: "energy", to: "averageEnergy", relation: "energy particles keep agents alive" },
      { from: "temperature", to: "stabilityScore", relation: "extreme temperature reduces stability" },
      { from: "population", to: "collisionCount", relation: "more agents increase interactions" },
      { from: "gravity", to: "settling", relation: "higher gravity pulls agents downward" }
    ],
    visualModel: {
      renderer: "unity-webgl-or-canvas-fallback",
      scene: "dark scientific simulation chamber",
      primitives: ["agent spheres", "energy field", "temperature gradient", "collision pulses"],
      colorMap: {
        stable: "#63f5d5",
        energy: "#ffd166",
        temperature: "#ff6b6b",
        motion: "#7dd3fc"
      }
    },
    controls: {
      gravity: { min: 0, max: 20, unit: "m/s2" },
      speed: { min: 0.1, max: 4, unit: "x" },
      population: { min: 5, max: 120, unit: "agents" },
      energy: { min: 0, max: 100, unit: "%" },
      temperature: { min: -20, max: 80, unit: "C" }
    },
    resultsRequest: {
      aliveAgents: true,
      averageEnergy: true,
      collisionCount: true,
      stabilityScore: true
    }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places = 2) {
    const factor = Math.pow(10, places);
    return Math.round(value * factor) / factor;
  }

  function sanitizeText(value) {
    return String(value == null ? "" : value).replace(/[<>&]/g, (char) => ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;"
    }[char]));
  }

  function findUnityInstance() {
    return window.sciloopUnityInstance || window.unityInstance || window.UnityInstance || null;
  }

  function isUnityReady() {
    const instance = findUnityInstance();
    return Boolean(instance && typeof instance.SendMessage === "function");
  }

  function ensureStyles() {
    if (byId("sciloopUnityBridgeStyles")) return;
    const style = document.createElement("style");
    style.id = "sciloopUnityBridgeStyles";
    style.textContent = `
      #unitySimulationBridgePortal {
        --unity-cyan: #7dd3fc;
        --unity-green: #63f5d5;
        --unity-gold: #ffd166;
        --unity-red: #ff6b6b;
      }
      .unity-bridge-shell {
        display: grid;
        gap: 1rem;
        animation: unitySandboxArrive 560ms ease both;
      }
      .unity-bridge-hero,
      .unity-bridge-panel {
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: linear-gradient(180deg, rgba(7, 16, 29, 0.88), rgba(4, 9, 18, 0.92));
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.26);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
      }
      .unity-bridge-hero::before,
      .unity-bridge-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 18% 0%, rgba(125, 211, 252, 0.13), transparent 30%),
          linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.045) 46%, transparent 58%);
        opacity: 0.72;
        transform: translateX(-18%);
        animation: unityPanelSheen 7.5s ease-in-out infinite;
      }
      .unity-bridge-panel:hover {
        transform: translateY(-2px);
        border-color: rgba(125, 211, 252, 0.34);
        box-shadow: 0 28px 92px rgba(0, 0, 0, 0.34), 0 0 34px rgba(125, 211, 252, 0.08);
      }
      .unity-bridge-hero {
        padding: clamp(1.25rem, 2vw, 2rem);
      }
      .unity-bridge-hero h2 {
        margin: 0.4rem 0 0.35rem;
        color: #f5fbff;
        font-size: clamp(2rem, 4vw, 4.4rem);
        letter-spacing: 0;
      }
      .unity-bridge-hero p {
        max-width: 860px;
        color: rgba(225, 240, 255, 0.78);
        line-height: 1.7;
      }
      .unity-bridge-grid {
        display: grid;
        grid-template-columns: minmax(260px, 0.72fr) minmax(320px, 1.28fr);
        gap: 1rem;
        align-items: stretch;
      }
      .unity-bridge-panel {
        padding: 1rem;
      }
      .unity-control-stack {
        display: grid;
        gap: 0.8rem;
      }
      .unity-control {
        display: grid;
        gap: 0.45rem;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.035);
        border-radius: 8px;
        transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
      }
      .unity-control:hover {
        border-color: rgba(125, 211, 252, 0.24);
        background: rgba(125, 211, 252, 0.055);
        transform: translateX(2px);
      }
      .unity-control label {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        color: #eef8ff;
        font-size: 0.92rem;
      }
      .unity-control output {
        color: var(--unity-cyan);
        font-variant-numeric: tabular-nums;
      }
      .unity-control input[type="range"] {
        width: 100%;
        accent-color: var(--unity-cyan);
      }
      .unity-control input[type="range"]:focus-visible,
      .unity-select-row select:focus-visible,
      .unity-bridge-button:focus-visible {
        outline: 2px solid rgba(125, 211, 252, 0.75);
        outline-offset: 3px;
      }
      .unity-select-row {
        display: grid;
        gap: 0.45rem;
        margin-bottom: 0.85rem;
      }
      .unity-select-row label {
        color: rgba(225, 240, 255, 0.76);
        font-size: 0.86rem;
      }
      .unity-select-row select {
        width: 100%;
        min-height: 2.6rem;
        border: 1px solid rgba(125, 211, 252, 0.2);
        border-radius: 8px;
        background: rgba(3, 7, 17, 0.88);
        color: #f5fbff;
        padding: 0 0.75rem;
      }
      .unity-button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 0.85rem;
      }
      .unity-bridge-button {
        min-height: 2.5rem;
        border: 1px solid rgba(125, 211, 252, 0.25);
        border-radius: 999px;
        background: rgba(125, 211, 252, 0.1);
        color: #f5fbff;
        padding: 0.6rem 0.95rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
      }
      .unity-bridge-button::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.18), transparent);
        transform: translateX(-120%);
        transition: transform 420ms ease;
      }
      .unity-bridge-button:hover {
        border-color: rgba(125, 211, 252, 0.5);
        background: rgba(125, 211, 252, 0.16);
        box-shadow: 0 0 24px rgba(125, 211, 252, 0.15);
        transform: translateY(-1px);
      }
      .unity-bridge-button:hover::after {
        transform: translateX(120%);
      }
      .unity-bridge-button:active {
        transform: translateY(0) scale(0.985);
      }
      .unity-status-row,
      .unity-results-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.65rem;
      }
      .unity-status-pill,
      .unity-result-card {
        min-height: 4.75rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.035);
        border-radius: 8px;
        padding: 0.75rem;
        transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
      }
      .unity-status-pill:hover,
      .unity-result-card:hover {
        border-color: rgba(255, 209, 102, 0.26);
        background: rgba(255, 209, 102, 0.05);
        transform: translateY(-1px);
      }
      .unity-status-pill span,
      .unity-result-card span {
        display: block;
        color: rgba(225, 240, 255, 0.58);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .unity-status-pill strong,
      .unity-result-card strong {
        display: block;
        margin-top: 0.3rem;
        color: #ffffff;
        font-size: 1.35rem;
        text-shadow: 0 0 18px rgba(125, 211, 252, 0.2);
      }
      .unity-viewport {
        position: relative;
        min-height: 440px;
        overflow: hidden;
        border: 1px solid rgba(125, 211, 252, 0.16);
        border-radius: 8px;
        background: #030711;
        box-shadow: inset 0 0 46px rgba(125, 211, 252, 0.07);
      }
      .unity-viewport::before {
        content: "";
        position: absolute;
        inset: -20%;
        pointer-events: none;
        background:
          radial-gradient(circle at 25% 30%, rgba(99, 245, 213, 0.1), transparent 24%),
          radial-gradient(circle at 72% 62%, rgba(255, 209, 102, 0.08), transparent 22%);
        animation: unityAmbientDrift 12s ease-in-out infinite alternate;
        z-index: 1;
      }
      .unity-webgl-frame,
      #unityFallbackCanvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }
      .unity-webgl-frame {
        display: none;
      }
      .unity-viewport.unity-loaded .unity-webgl-frame {
        display: block;
      }
      .unity-viewport.unity-loaded #unityFallbackCanvas {
        opacity: 0.14;
      }
      .unity-overlay-note {
        position: absolute;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(4, 9, 18, 0.76);
        color: rgba(238, 248, 255, 0.82);
        border-radius: 8px;
        padding: 0.75rem;
        backdrop-filter: blur(12px);
        z-index: 2;
        animation: unitySoftPulse 3.4s ease-in-out infinite;
      }
      .unity-json-preview {
        max-height: 320px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
        color: #caeaff;
        background: rgba(0, 0, 0, 0.32);
        border-radius: 8px;
        padding: 0.9rem;
        font-size: 0.78rem;
        line-height: 1.55;
      }
      .unity-explanation {
        color: rgba(225, 240, 255, 0.76);
        line-height: 1.7;
      }
      @keyframes unitySandboxArrive {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes unityPanelSheen {
        0%, 52%, 100% {
          opacity: 0.36;
          transform: translateX(-28%);
        }
        68% {
          opacity: 0.9;
          transform: translateX(28%);
        }
      }
      @keyframes unityAmbientDrift {
        from {
          transform: translate3d(-2%, -1%, 0) rotate(0deg);
          opacity: 0.68;
        }
        to {
          transform: translate3d(2%, 1%, 0) rotate(7deg);
          opacity: 1;
        }
      }
      @keyframes unitySoftPulse {
        0%, 100% {
          box-shadow: 0 0 0 rgba(125, 211, 252, 0);
        }
        50% {
          box-shadow: 0 0 24px rgba(125, 211, 252, 0.12);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .unity-bridge-shell,
        .unity-bridge-hero::before,
        .unity-bridge-panel::before,
        .unity-viewport::before,
        .unity-overlay-note {
          animation: none;
        }
        .unity-bridge-panel,
        .unity-control,
        .unity-bridge-button,
        .unity-status-pill,
        .unity-result-card {
          transition: none;
        }
      }
      @media (max-width: 980px) {
        .unity-bridge-grid,
        .unity-status-row,
        .unity-results-grid {
          grid-template-columns: 1fr;
        }
        .unity-viewport {
          min-height: 360px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createPortalMarkup() {
    const section = document.createElement("section");
    section.id = "unitySimulationBridgePortal";
    section.className = "portal";
    section.setAttribute("aria-label", "Unity AI Sandbox");
    section.innerHTML = `
      <div class="unity-bridge-shell">
        <article class="unity-bridge-hero">
          <div class="lab-label">Unity WebGL AI simulation</div>
          <h2>Unity AI Sandbox</h2>
          <p>SciLoop creates the intelligence model, JSON carries the command, and Unity visualizes the 3D simulation. When Unity is not loaded, the same model runs in the SciLoop canvas fallback.</p>
        </article>

        <div class="unity-status-row" aria-live="polite">
          <div class="unity-status-pill"><span>Bridge</span><strong id="unityBridgeStatus">Fallback</strong></div>
          <div class="unity-status-pill"><span>Simulation</span><strong id="unitySimulationLabel">Ecosystem</strong></div>
          <div class="unity-status-pill"><span>Transport</span><strong id="unityTransportLabel">Canvas</strong></div>
          <div class="unity-status-pill"><span>Version</span><strong>${BRIDGE_VERSION}</strong></div>
        </div>

        <div class="unity-bridge-grid">
          <article class="unity-bridge-panel">
            <div class="lab-label">Live controls</div>
            <div class="unity-select-row">
              <label for="unitySimulationType">Simulation type</label>
              <select id="unitySimulationType">
                <option value="ecosystem">AI ecosystem</option>
                <option value="molecular">Molecular swarm</option>
                <option value="climate">Climate pressure</option>
                <option value="population">Population dynamics</option>
                <option value="neural">Neural signal field</option>
              </select>
            </div>
            <div class="unity-control-stack" id="unityControlStack"></div>
            <div class="unity-button-row">
              <button class="unity-bridge-button" id="unitySendButton" type="button">Start / Send to Unity</button>
              <button class="unity-bridge-button" id="unityResetButton" type="button">Reset</button>
              <button class="unity-bridge-button" id="unitySampleButton" type="button">Load sample</button>
              <button class="unity-bridge-button" id="unityCopyJsonButton" type="button">Copy JSON</button>
            </div>
          </article>

          <article class="unity-bridge-panel">
            <div class="unity-viewport" id="unityViewport">
              <iframe class="unity-webgl-frame" id="unityWebglFrame" title="Unity WebGL simulation" data-src=""></iframe>
              <canvas id="unityFallbackCanvas" width="1280" height="720" aria-label="Fallback SciLoop simulation"></canvas>
              <div class="unity-overlay-note" id="unityOverlayNote">Unity WebGL is not loaded yet. SciLoop is rendering the fallback simulation and sending the same JSON shape.</div>
            </div>
          </article>
        </div>

        <div class="unity-bridge-grid">
          <article class="unity-bridge-panel">
            <div class="lab-label">Unity results</div>
            <div class="unity-results-grid">
              <div class="unity-result-card"><span>Alive agents</span><strong id="unityResultAlive">34</strong></div>
              <div class="unity-result-card"><span>Average energy</span><strong id="unityResultEnergy">62%</strong></div>
              <div class="unity-result-card"><span>Collisions</span><strong id="unityResultCollisions">0</strong></div>
              <div class="unity-result-card"><span>Stability</span><strong id="unityResultStability">78%</strong></div>
            </div>
            <p class="unity-explanation" id="unityExplanationText">The fallback engine is running a lightweight AI-agent simulation. Agents wander, avoid walls, seek energy particles, lose energy over time, and die when energy reaches zero.</p>
          </article>

          <article class="unity-bridge-panel">
            <div class="lab-label">Simulation JSON</div>
            <pre class="unity-json-preview" id="unityJsonPreview"></pre>
          </article>
        </div>
      </div>
    `;
    return section;
  }

  function createControl({ id, label, min, max, step, value, unit }) {
    const wrap = document.createElement("div");
    wrap.className = "unity-control";
    wrap.innerHTML = `
      <label for="${id}">
        <span>${sanitizeText(label)}</span>
        <output id="${id}Value">${sanitizeText(value)}${sanitizeText(unit)}</output>
      </label>
      <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">
    `;
    return wrap;
  }

  function mountControls() {
    const stack = byId("unityControlStack");
    if (!stack || stack.dataset.ready) return;
    stack.dataset.ready = "1";
    [
      { id: "unityGravity", label: "Gravity", min: 0, max: 20, step: 0.1, value: state.gravity, unit: "" },
      { id: "unitySpeed", label: "Speed", min: 0.1, max: 4, step: 0.1, value: state.speed, unit: "x" },
      { id: "unityPopulation", label: "Population", min: 5, max: 120, step: 1, value: state.population, unit: "" },
      { id: "unityEnergy", label: "Energy", min: 0, max: 100, step: 1, value: state.energy, unit: "%" },
      { id: "unityTemperature", label: "Temperature", min: -20, max: 80, step: 1, value: state.temperature, unit: "C" }
    ].forEach((control) => stack.appendChild(createControl(control)));

    ["Gravity", "Speed", "Population", "Energy", "Temperature"].forEach((name) => {
      const input = byId(`unity${name}`);
      input?.addEventListener("input", () => {
        readControls();
        updateBridge();
      });
    });
    byId("unitySimulationType")?.addEventListener("change", () => {
      readControls();
      resetFallbackAgents();
      updateBridge();
    });

    byId("unitySendButton")?.addEventListener("click", () => sendCurrentCommand());
    byId("unityResetButton")?.addEventListener("click", () => resetSimulation());
    byId("unitySampleButton")?.addEventListener("click", () => loadSampleSimulation());
    byId("unityCopyJsonButton")?.addEventListener("click", copyCurrentJson);
  }

  function getUnityFrameUrl() {
    const params = new URLSearchParams(window.location.search || "");
    return params.get("unityUrl") || window.SCILOOP_UNITY_WEBGL_URL || "";
  }

  function configureUnityFrame(url) {
    const iframe = byId("unityWebglFrame");
    if (!iframe) return;
    const targetUrl = url || getUnityFrameUrl();
    if (!targetUrl) return;
    iframe.src = targetUrl;
    iframe.dataset.src = targetUrl;
    byId("unityTransportLabel") && (byId("unityTransportLabel").textContent = "Iframe");
  }

  function readControls() {
    state.simulationType = byId("unitySimulationType")?.value || state.simulationType;
    state.gravity = Number(byId("unityGravity")?.value || state.gravity);
    state.speed = Number(byId("unitySpeed")?.value || state.speed);
    state.population = Number(byId("unityPopulation")?.value || state.population);
    state.energy = Number(byId("unityEnergy")?.value || state.energy);
    state.temperature = Number(byId("unityTemperature")?.value || state.temperature);
    updateOutput("unitySimulationLabel", state.simulationType.replace(/-/g, " "));
    updateOutput("unityGravityValue", round(state.gravity, 1));
    updateOutput("unitySpeedValue", `${round(state.speed, 1)}x`);
    updateOutput("unityPopulationValue", Math.round(state.population));
    updateOutput("unityEnergyValue", `${Math.round(state.energy)}%`);
    updateOutput("unityTemperatureValue", `${Math.round(state.temperature)}C`);
  }

  function resetSimulation() {
    state.frame = 0;
    state.collisionCount = 0;
    state.averageSpeed = 0;
    state.averageEnergy = 0;
    state.aliveAgents = 0;
    state.stabilityScore = 1;
    resetFallbackAgents(true);
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    const instance = findUnityInstance();
    if (instance && typeof instance.SendMessage === "function") {
      try {
        instance.SendMessage(UNITY_OBJECT_NAME, "ResetSimulation", "");
      } catch {
        // Unity reset is optional; the SciLoop fallback still resets immediately.
      }
    }
    renderResults({
      aliveAgents: 0,
      averageEnergy: 0,
      collisionCount: 0,
      stabilityScore: 1
    });
    const text = byId("unityExplanationText");
    if (text) {
      text.textContent = "Simulation reset. Press Start / Send to Unity to run the AI-agent sandbox again.";
    }
  }

  function updateOutput(id, value) {
    const node = byId(id);
    if (node) node.textContent = String(value);
  }

  function generateSimulationCommand() {
    const temperatureStress = Math.abs(state.temperature - 24) / 80;
    const crowdStress = Math.max(0, (state.population - 45) / 95);
    const energyBoost = state.energy / 100;
    const stability = clamp(0.92 - temperatureStress * 0.5 - crowdStress * 0.28 + energyBoost * 0.12, 0.05, 0.99);
    const averageSpeed = clamp(state.speed * (0.45 + energyBoost) * (1 - temperatureStress * 0.25), 0.05, 9.99);
    const collisionRate = Math.max(0, Math.round((state.population * state.speed * (1 + crowdStress) * 0.04) - stability * 2));

    state.averageSpeed = averageSpeed;
    state.averageEnergy = clamp(state.averageEnergy || state.energy, 0, 100);
    state.aliveAgents = state.particles.length ? state.particles.filter((particle) => particle.alive !== false).length : Math.round(state.population);
    state.collisionCount += Math.max(0, Math.floor(collisionRate / 3));
    state.stabilityScore = stability;

    const command = {
      source: "SciLoop",
      target: "Unity",
      version: "1.0",
      simulationType: state.simulationType,
      entities: [
        {
          id: "ai_agents",
          type: "agent",
          name: "AI Agent",
          count: Math.round(state.population),
          energy: Math.round(state.energy),
          speed: round(state.speed, 2),
          behavior: ["wander", "seek_energy", "avoid_walls"]
        },
        {
          id: "energy_particles",
          type: "resource",
          name: "Energy Particle",
          count: Math.max(4, Math.round(state.population / 4)),
          energyValue: Math.max(8, Math.round(state.energy / 3))
        },
        {
          id: "environment",
          type: "field",
          name: "Simulation Chamber",
          value: Math.round(state.temperature)
        }
      ],
      variables: {
        gravity: round(state.gravity, 2),
        speed: round(state.speed, 2),
        population: Math.round(state.population),
        energy: Math.round(state.energy),
        temperature: Math.round(state.temperature)
      },
      causalRelations: [
        { from: "energyParticles", to: "averageEnergy", relation: "agents recover energy when they reach a particle" },
        { from: "population", to: "collisionCount", relation: "more agents create more collisions" },
        { from: "temperature", to: "stabilityScore", relation: "temperature far from the comfort zone lowers stability" },
        { from: "gravity", to: "verticalSettling", relation: "higher gravity pulls the simulation closer to the floor plane" }
      ],
      visualModel: {
        renderer: isUnityReady() ? "unity-webgl" : "canvas-fallback",
        scene: "SciLoop simulation chamber",
        camera: "orbit",
        palette: ["#7dd3fc", "#63f5d5", "#ffd166", "#ff6b6b"],
        effects: ["agent trails", "collision flashes", "energy glow", "temperature haze"]
      },
      controls: {
        gravity: state.gravity,
        speed: state.speed,
        population: state.population,
        energy: state.energy,
        temperature: state.temperature
      },
      resultsRequest: {
        aliveAgents: true,
        averageEnergy: true,
        collisionCount: true,
        stabilityScore: true
      },
      bridgeMeta: {
        protocol: "sciloop-unity-simulation-bridge",
        version: BRIDGE_VERSION,
        targetObject: UNITY_OBJECT_NAME,
        targetMethod: UNITY_METHOD_NAME,
        generatedAt: new Date().toISOString()
      }
    };

    state.lastJson = command;
    return command;
  }

  function sendToUnity(command) {
    const payload = JSON.stringify(command);
    const instance = findUnityInstance();
    if (instance && typeof instance.SendMessage === "function") {
      try {
        instance.SendMessage(UNITY_OBJECT_NAME, UNITY_METHOD_NAME, payload);
        updateUnityStatus(true, "Unity WebGL");
        return { ok: true, mode: "unity-webgl" };
      } catch (error) {
        updateUnityStatus(false, "Canvas");
        return { ok: false, mode: "fallback", error: error instanceof Error ? error.message : String(error) };
      }
    }
    updateUnityStatus(false, "Canvas");
    return { ok: false, mode: "fallback", error: "Unity WebGL instance not available." };
  }

  function sendCurrentCommand() {
    if (!state.animationId) drawFallbackFrame();
    const command = generateSimulationCommand();
    const result = sendToUnity(command);
    updateJsonPreview(command);
    updateExplanation(result);
    renderResults();
    return result;
  }

  function updateBridge() {
    const command = generateSimulationCommand();
    updateJsonPreview(command);
    updateExplanation({ ok: isUnityReady(), mode: isUnityReady() ? "unity-webgl" : "fallback" });
    renderResults();
    if (isUnityReady()) sendToUnity(command);
  }

  function updateUnityStatus(available, transport) {
    state.unityAvailable = available;
    byId("unityBridgeStatus") && (byId("unityBridgeStatus").textContent = available ? "Unity live" : "Fallback");
    byId("unityTransportLabel") && (byId("unityTransportLabel").textContent = transport || (available ? "Unity" : "Canvas"));
    byId("unityViewport")?.classList.toggle("unity-loaded", available);
    const note = byId("unityOverlayNote");
    if (note) {
      note.textContent = available
        ? "Unity WebGL is available. Slider changes are being sent with unityInstance.SendMessage."
        : "Unity WebGL is not loaded yet. SciLoop is rendering the fallback simulation and sending the same JSON shape.";
    }
  }

  function updateJsonPreview(command) {
    const preview = byId("unityJsonPreview");
    if (preview) preview.textContent = JSON.stringify(command, null, 2);
  }

  function renderResults(results) {
    const data = results || {
      aliveAgents: state.aliveAgents,
      averageEnergy: state.averageEnergy,
      collisionCount: state.collisionCount,
      stabilityScore: state.stabilityScore
    };
    const aliveAgents = data.aliveAgents ?? data.objectCount ?? data.objects ?? Math.round(state.population);
    const averageEnergy = data.averageEnergy ?? data.energy ?? state.averageEnergy ?? state.energy;
    updateOutput("unityResultAlive", Math.round(aliveAgents));
    updateOutput("unityResultEnergy", `${Math.round(averageEnergy)}%`);
    updateOutput("unityResultCollisions", data.collisionCount ?? state.collisionCount);
    updateOutput("unityResultStability", `${Math.round((data.stabilityScore ?? state.stabilityScore) * 100)}%`);
  }

  function updateExplanation(sendResult) {
    const text = byId("unityExplanationText");
    if (!text) return;
    const stability = Math.round(state.stabilityScore * 100);
    const mode = sendResult && sendResult.ok ? "Unity is receiving the live JSON." : "SciLoop is using the canvas fallback.";
    text.textContent = `${mode} The scene has ${Math.round(state.aliveAgents || state.population)} living agents. They wander, avoid walls, seek energy particles, and lose energy over time. Population raises collisions, while extreme temperature lowers stability. Current stability is ${stability}%.`;
  }

  function copyCurrentJson() {
    const command = state.lastJson || generateSimulationCommand();
    const json = JSON.stringify(command, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(json).catch(() => {});
    }
    updateJsonPreview(command);
  }

  function loadSampleSimulation() {
    setControlValue("unitySimulationType", sampleSimulation.simulationType);
    setControlValue("unityGravity", sampleSimulation.variables.gravity);
    setControlValue("unitySpeed", sampleSimulation.variables.speed);
    setControlValue("unityPopulation", sampleSimulation.variables.population);
    setControlValue("unityEnergy", sampleSimulation.variables.energy);
    setControlValue("unityTemperature", sampleSimulation.variables.temperature);
    readControls();
    resetFallbackAgents();
    updateBridge();
  }

  function setControlValue(id, value) {
    const input = byId(id);
    if (input) input.value = String(value);
  }

  function resetFallbackAgents(empty = false) {
    state.particles = [];
    state.resources = [];
    state.averageEnergy = empty ? 0 : state.energy;
    state.aliveAgents = empty ? 0 : Math.round(state.population);
  }

  function ensureParticles(width, height) {
    const desired = Math.round(state.population);
    while (state.particles.length < desired) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      state.particles.push({
        x,
        y,
        previousX: x,
        previousY: y,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        radius: 3 + Math.random() * 4,
        hue: Math.random(),
        energy: state.energy,
        alive: true
      });
    }
    while (state.particles.length > desired) state.particles.pop();
    for (const particle of state.particles) {
      if (typeof particle.energy !== "number") particle.energy = state.energy;
      if (particle.energy > 0) particle.alive = true;
    }
  }

  function ensureResources(width, height) {
    const desired = Math.max(4, Math.round(state.population / 4));
    while (state.resources.length < desired) {
      state.resources.push({
        x: 32 + Math.random() * Math.max(1, width - 64),
        y: 32 + Math.random() * Math.max(1, height - 64),
        value: Math.max(8, state.energy / 3),
        pulse: Math.random() * Math.PI * 2
      });
    }
    while (state.resources.length > desired) state.resources.pop();
  }

  function findNearestResource(agent) {
    let nearest = null;
    let nearestDistance = Infinity;
    for (const resource of state.resources) {
      const dx = resource.x - agent.x;
      const dy = resource.y - agent.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = resource;
      }
    }
    return { resource: nearest, distance: nearestDistance };
  }

  function drawFallbackFrame() {
    const canvas = byId("unityFallbackCanvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const width = Math.max(320, Math.floor(rect.width * dpr));
    const height = Math.max(240, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    state.canvasContext = ctx;
    ensureParticles(width, height);
    ensureResources(width, height);
    state.frame += 1;

    const energy = state.energy / 100;
    const temp = clamp((state.temperature + 20) / 100, 0, 1);
    const speed = state.speed * (0.55 + energy);
    const gravity = (state.gravity - 9.8) * 0.002 * dpr;

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#030711");
    bg.addColorStop(0.5, temp > 0.58 ? "#160c12" : "#061321");
    bg.addColorStop(1, "#02050c");
    ctx.save();
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(125, 211, 252, 0.08)";
    ctx.lineWidth = 1 * dpr;
    const grid = 64 * dpr;
    for (let x = 0; x < width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    let collisions = 0;
    let aliveAgents = 0;
    let energyTotal = 0;
    for (const p of state.particles) {
      if (p.energy <= 0) {
        p.alive = false;
      }
      if (p.alive === false) continue;

      const nearest = findNearestResource(p);
      if (nearest.resource) {
        const dx = nearest.resource.x - p.x;
        const dy = nearest.resource.y - p.y;
        const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        p.vx += (dx / distance) * 0.018 * speed;
        p.vy += (dy / distance) * 0.018 * speed;
        if (nearest.distance < 18 * dpr) {
          p.energy = clamp(p.energy + nearest.resource.value, 0, 100);
          nearest.resource.x = 32 + Math.random() * Math.max(1, width - 64);
          nearest.resource.y = 32 + Math.random() * Math.max(1, height - 64);
        }
      }

      p.energy = clamp(p.energy - (0.018 + state.speed * 0.006 + Math.abs(state.temperature - 24) * 0.0008), 0, 100);
      p.vy += gravity;
      p.vx += (Math.random() - 0.5) * 0.04;
      p.vy += (Math.random() - 0.5) * 0.04;
      p.vx = clamp(p.vx, -2.8, 2.8);
      p.vy = clamp(p.vy, -2.8, 2.8);
      p.previousX = p.x;
      p.previousY = p.y;
      p.x += p.vx * speed * dpr;
      p.y += p.vy * speed * dpr;

      if (p.x < 18 || p.x > width - 18) {
        p.vx *= -0.86;
        collisions += 1;
      }
      if (p.y < 18 || p.y > height - 18) {
        p.vy *= -0.86;
        collisions += 1;
      }
      p.x = clamp(p.x, 18, width - 18);
      p.y = clamp(p.y, 18, height - 18);
      aliveAgents += 1;
      energyTotal += p.energy;
    }

    state.collisionCount += Math.floor(collisions / 10);
    state.aliveAgents = aliveAgents;
    state.averageEnergy = aliveAgents > 0 ? energyTotal / aliveAgents : 0;
    if (state.frame % 15 === 0) {
      renderResults();
      updateExplanation({ ok: isUnityReady(), mode: isUnityReady() ? "unity-webgl" : "fallback" });
    }

    ctx.save();
    for (const resource of state.resources) {
      resource.pulse += 0.045;
      const radius = (6 + Math.sin(resource.pulse) * 2) * dpr;
      const halo = radius * 3.6;
      const gradient = ctx.createRadialGradient(resource.x, resource.y, radius * 0.4, resource.x, resource.y, halo);
      gradient.addColorStop(0, "rgba(255, 209, 102, 0.28)");
      gradient.addColorStop(1, "rgba(255, 209, 102, 0)");
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(resource.x, resource.y, halo, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 209, 102, 0.92)";
      ctx.shadowColor = "rgba(255, 209, 102, 0.55)";
      ctx.shadowBlur = 22 * dpr;
      ctx.arc(resource.x, resource.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const p of state.particles) {
      if (p.alive === false) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 107, 107, 0.26)";
        ctx.arc(p.x, p.y, p.radius * dpr, 0, Math.PI * 2);
        ctx.stroke();
        continue;
      }
      const color = p.hue > 0.66 ? "125, 211, 252" : p.hue > 0.33 ? "99, 245, 213" : "255, 209, 102";
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${color}, ${0.08 + p.energy / 520})`;
      ctx.lineWidth = Math.max(1, p.radius * 0.58) * dpr;
      ctx.moveTo(p.previousX || p.x, p.previousY || p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color}, ${0.38 + p.energy / 170})`;
      ctx.shadowColor = `rgba(${color}, 0.42)`;
      ctx.shadowBlur = 18 * dpr;
      ctx.arc(p.x, p.y, p.radius * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const fieldWidth = width * energy;
    const field = ctx.createLinearGradient(0, 0, fieldWidth, 0);
    field.addColorStop(0, "rgba(255, 209, 102, 0.08)");
    field.addColorStop(1, "rgba(125, 211, 252, 0.18)");
    ctx.fillStyle = field;
    ctx.fillRect(0, height - 26 * dpr, fieldWidth, 8 * dpr);

    state.animationId = requestAnimationFrame(drawFallbackFrame);
  }

  function receiveUnityResults(json) {
    let results = json;
    if (typeof json === "string") {
      try {
        results = JSON.parse(json);
      } catch {
        results = {};
      }
    }
    renderResults({
      aliveAgents: Number(results.aliveAgents ?? results.objectCount ?? results.objects ?? state.population),
      averageEnergy: Number(results.averageEnergy ?? results.energy ?? state.averageEnergy),
      collisionCount: Number(results.collisionCount ?? state.collisionCount),
      stabilityScore: Number(results.stabilityScore ?? state.stabilityScore)
    });
    updateExplanation({ ok: true, mode: "unity-webgl" });
  }

  function addPortalButton() {
    const tabs = document.querySelector(".portal-tabs");
    if (!tabs || byId("unitySimulationBridgeTab")) return;
    const button = document.createElement("button");
    button.id = "unitySimulationBridgeTab";
    button.className = "portal-btn";
    button.type = "button";
    button.textContent = "Unity AI Sandbox";
    button.addEventListener("click", () => activateUnityPortal());
    const anchor = byId("realityVisualizationTab") || byId("universalVisualTab") || byId("newsTab");
    if (anchor && anchor.parentElement === tabs) {
      anchor.insertAdjacentElement("afterend", button);
    } else {
      tabs.appendChild(button);
    }
  }

  function deactivateUnityPortal() {
    byId("unitySimulationBridgePortal")?.classList.remove("active");
    byId("unitySimulationBridgeTab")?.classList.remove("active");
  }

  function addPortalSection() {
    if (byId("unitySimulationBridgePortal")) return;
    const portal = createPortalMarkup();
    const anchor = byId("realityVisualizationPortal") || byId("universalVisualPortal") || byId("newsPortal");
    if (anchor) {
      anchor.insertAdjacentElement("afterend", portal);
    } else {
      document.body.appendChild(portal);
    }
  }

  function activateUnityPortal() {
    document.querySelectorAll(".portal").forEach((portal) => portal.classList.remove("active"));
    document.querySelectorAll(".portal-btn").forEach((button) => button.classList.remove("active"));
    byId("unitySimulationBridgePortal")?.classList.add("active");
    byId("unitySimulationBridgeTab")?.classList.add("active");
    const footer = byId("footerNote");
    if (footer) {
      footer.textContent = "Unity AI Sandbox sends SciLoop JSON into Unity WebGL and keeps an AI-agent canvas fallback active when Unity is offline.";
    }
    if (location.hash !== "#unity-ai-sandbox") {
      history.replaceState(null, "", "#unity-ai-sandbox");
    }
    requestAnimationFrame(() => {
      byId("unitySimulationBridgePortal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    updateBridge();
  }

  function bindPortalExitHandlers() {
    if (document.body.dataset.unityBridgeExitHandlers) return;
    document.body.dataset.unityBridgeExitHandlers = "1";
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest(".portal-btn, [data-portal-jump]") : null;
      if (!target || target.id === "unitySimulationBridgeTab") return;
      if (target.getAttribute("data-portal-jump") === "unity") return;
      deactivateUnityPortal();
    }, true);
  }

  function initUnityBridgePortal() {
    ensureStyles();
    addPortalButton();
    addPortalSection();
    bindPortalExitHandlers();
    mountControls();
    configureUnityFrame();
    readControls();
    updateBridge();
    updateUnityStatus(isUnityReady(), isUnityReady() ? "Unity WebGL" : "Canvas");
    if (!state.animationId) drawFallbackFrame();
    if (location.hash.toLowerCase().includes("unity")) activateUnityPortal();
  }

  window.sciloopUnityBridge = {
    init: initUnityBridgePortal,
    generateSimulationCommand,
    sendToUnity,
    sendCurrentCommand,
    receiveUnityResults,
    resetSimulation,
    loadSampleSimulation,
    setUnityFrameUrl: configureUnityFrame,
    setUnityInstance(instance) {
      window.sciloopUnityInstance = instance;
      updateUnityStatus(isUnityReady(), isUnityReady() ? "Unity WebGL" : "Canvas");
      updateBridge();
    }
  };
  window.receiveSciLoopUnityResults = receiveUnityResults;
  window.receiveUnityResults = receiveUnityResults;

  window.addEventListener("hashchange", () => {
    if (location.hash.toLowerCase().includes("unity")) {
      activateUnityPortal();
    } else {
      deactivateUnityPortal();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUnityBridgePortal);
  } else {
    initUnityBridgePortal();
  }
})();
