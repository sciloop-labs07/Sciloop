const DEFAULT_PROTOCOL = "sciloop-unity-visual-bridge-v0.1";
const MAX_OBJECTS = 16;
const MAX_EFFECTS = 24;

function cleanText(value, fallback = "") {
  const text = String(value ?? fallback).replace(/\s+/g, " ").trim();
  return text || fallback;
}

function slug(value, fallback = "item") {
  const text = cleanText(value, fallback)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return text || fallback;
}

function clampNumber(value, min, max, fallback = min) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, numeric));
}

function normalizeColor(value, fallback = "#53e7ff") {
  const text = cleanText(value, fallback);
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function vector3(value, fallback = [0, 0, 0]) {
  if (!Array.isArray(value)) return fallback;
  return [
    clampNumber(value[0], -50, 50, fallback[0] || 0),
    clampNumber(value[1], -50, 50, fallback[1] || 0),
    clampNumber(value[2], -50, 50, fallback[2] || 0)
  ];
}

function getSubjectTitle(visualPlan = {}) {
  return cleanText(visualPlan.subject || visualPlan.subjectId || "Applied Reality", "Applied Reality");
}

function getSceneNodes(visualPlan = {}) {
  const nodes = Array.isArray(visualPlan.visualScene?.nodes) ? visualPlan.visualScene.nodes : [];
  const objects = Array.isArray(visualPlan.visualScene?.objects) ? visualPlan.visualScene.objects : [];
  const detected = Array.isArray(visualPlan.detected?.entities) ? visualPlan.detected.entities : [];

  if (nodes.length) return nodes;
  if (objects.length) return objects.map((object, index) => ({
    id: object.id || `object-${index + 1}`,
    label: object.label || object.name || object.id || `Object ${index + 1}`,
    type: object.type,
    color: object.color,
    position: object.position,
    scale: object.scale
  }));

  return detected.slice(0, 6).map((entity, index) => ({
    id: slug(entity, `entity-${index + 1}`),
    label: entity,
    type: index === 0 ? "primary" : "support"
  }));
}

function objectTypeForNode(node = {}, index = 0) {
  const text = `${node.type || ""} ${node.role || ""} ${node.label || ""}`.toLowerCase();
  if (/energy|core|engine|power|atp|heat/.test(text)) return "energy_core";
  if (/field|force|spacetime|network|signal/.test(text)) return "field";
  if (/boundary|constraint|barrier|membrane/.test(text)) return "boundary";
  if (/particle|molecule|atom|electron|photon/.test(text)) return "particle_stream";
  if (index === 0) return "node";
  return index % 3 === 0 ? "world_panel" : "node";
}

function mapNodeToUnityObject(node = {}, index = 0, theme = {}) {
  const x = -4.5 + index * 1.8;
  const y = index % 2 === 0 ? 0.2 : 1.0;
  const z = index % 3 === 0 ? 0 : index % 3 === 1 ? 0.8 : -0.8;

  return {
    id: slug(node.id || node.label || `node-${index + 1}`, `node-${index + 1}`),
    type: objectTypeForNode(node, index),
    label: cleanText(node.label || node.name || `Node ${index + 1}`, `Node ${index + 1}`).slice(0, 64),
    color: normalizeColor(node.color || (index === 0 ? theme.secondary : theme.primary), index === 0 ? "#ffd166" : "#53e7ff"),
    position: vector3(node.position, [x, y, z]),
    scale: vector3(node.scale, index === 0 ? [1.2, 1.2, 1.2] : [0.9, 0.9, 0.9])
  };
}

function mapConnectionsToEffects(visualPlan = {}, objects = [], theme = {}) {
  const connections = Array.isArray(visualPlan.visualScene?.connections) ? visualPlan.visualScene.connections : [];
  const existingEffects = Array.isArray(visualPlan.visualScene?.effects) ? visualPlan.visualScene.effects : [];
  const fallbackConnections = objects.slice(0, -1).map((object, index) => ({
    from: object.id,
    to: objects[index + 1]?.id,
    label: visualPlan.detected?.processes?.[index] || "flow"
  }));

  return (connections.length ? connections : existingEffects.length ? existingEffects : fallbackConnections)
    .filter((connection) => connection?.from && connection?.to)
    .slice(0, MAX_EFFECTS)
    .map((connection, index) => ({
      id: slug(connection.id || `effect-${index + 1}`, `effect-${index + 1}`),
      type: /wave|field/i.test(connection.label || "") ? "wave" : index % 2 === 0 ? "energy_flow" : "glow",
      from: slug(connection.from, "from"),
      to: slug(connection.to, "to"),
      label: cleanText(connection.label || "flow", "flow").slice(0, 64),
      color: normalizeColor(connection.color || (index % 2 === 0 ? theme.primary : theme.accent), index % 2 === 0 ? "#53e7ff" : "#ffd166"),
      intensity: clampNumber(connection.intensity, 0.1, 5, 1)
    }));
}

function environmentForSubject(subject = "") {
  const key = slug(subject);
  const map = {
    biology: "cellular-lab",
    physics: "field-simulation-lab",
    chemistry: "molecular-reaction-chamber",
    neuroscience: "neural-network-chamber",
    mathematics: "abstract-geometry-space",
    "computer-science": "algorithm-data-center",
    "information-theory": "signal-channel-tunnel",
    thermodynamics: "heat-engine-chamber",
    "statistical-mechanics": "particle-swarm-chamber",
    "quantum-mechanics": "quantum-probability-chamber",
    relativity: "curved-spacetime-observatory",
    "evolutionary-theory": "population-landscape",
    economics: "market-flow-city",
    "game-theory": "strategy-arena",
    "materials-science": "crystal-lattice-lab",
    "artificial-intelligence": "neural-architecture-lab"
  };
  return map[key] || "dark-scientific-lab";
}

export function buildUnitySceneEnvelope(input = {}) {
  const visualPlan = input.visualPlan || input.localPlan || input;
  const subject = getSubjectTitle(visualPlan);
  const theme = {
    primary: normalizeColor(input.colorTheme?.primary || visualPlan.visualScene?.renderHints?.colorTheme?.primary, "#53e7ff"),
    secondary: normalizeColor(input.colorTheme?.secondary || visualPlan.visualScene?.renderHints?.colorTheme?.secondary, "#ffd166"),
    accent: normalizeColor(input.colorTheme?.accent || visualPlan.visualScene?.renderHints?.colorTheme?.accent, "#9be7ff")
  };
  const nodes = getSceneNodes(visualPlan);
  const objects = nodes.slice(0, MAX_OBJECTS).map((node, index) => mapNodeToUnityObject(node, index, theme));
  const effects = mapConnectionsToEffects(visualPlan, objects, theme);
  const timeline = Array.isArray(visualPlan.animationPlan) && visualPlan.animationPlan.length
    ? visualPlan.animationPlan
    : Array.isArray(visualPlan.visualScene?.animationTimeline) && visualPlan.visualScene.animationTimeline.length
      ? visualPlan.visualScene.animationTimeline
    : Array.isArray(visualPlan.visualScene?.stages)
      ? visualPlan.visualScene.stages.map((stage) => cleanText(stage.label || stage.detail || stage, "stage"))
      : ["Input appears", "Mechanism activates", "Outcome becomes visible"];

  return {
    ok: true,
    protocol: DEFAULT_PROTOCOL,
    type: "LOAD_VISUAL_PLAN_SCENE",
    schemaVersion: "0.1",
    generatedAt: new Date().toISOString(),
    source: "sciloop-universal-visual-language",
    visualPlanId: cleanText(visualPlan.id, `unity-${Date.now()}`),
    subject,
    title: cleanText(input.title || visualPlan.title, "SciLoop Unity Visual Scene"),
    renderIntent: "procedural-primitives-only",
    transport: {
      mode: "webgl-sendmessage-or-websocket",
      webglObjectName: "SciLoopRealitySceneController",
      webglMethodName: "LoadSceneJson"
    },
    safety: {
      executeGeneratedCode: false,
      acceptsOnlyJson: true,
      allowedPrimitiveTypes: ["node", "energy_core", "particle_stream", "field", "boundary", "world_panel"],
      maxObjects: MAX_OBJECTS,
      maxEffects: MAX_EFFECTS,
      notes: [
        "Unity should interpret this JSON with existing safe scripts.",
        "Do not compile or execute AI-generated C# at runtime.",
        "OpenAI keys stay on the backend only."
      ]
    },
    unity: {
      sceneRoot: "SciLoopGeneratedVisualRoot",
      recommendedReceiver: "Assets/Scripts/SciLoopRealitySceneController.cs",
      renderPipeline: input.renderPipeline || "URP-or-HDRP",
      targetQuality: input.targetQuality || "local-preview",
      buildTarget: input.buildTarget || "WebGL-or-Standalone"
    },
    scene: {
      environment: {
        type: input.environment || environmentForSubject(subject),
        lighting: "cinematic-dark-scientific",
        background: "glass-lab-grid"
      },
      camera: {
        mode: input.cameraMode || "orbit",
        position: [0, 2.6, 7.5],
        lookAt: [0, 0.4, 0],
        fov: 55
      },
      materials: [
        { name: "primary-glow", color: theme.primary, emissive: true },
        { name: "accent-gold", color: theme.secondary, emissive: true },
        { name: "soft-glass", color: "#0b1622", transparent: true }
      ],
      objects,
      effects,
      labels: objects.map((object) => ({ target: object.id, text: object.label })),
      animationTimeline: timeline.slice(0, 12).map((step, index) => ({
        time: index * 1.25,
        event: cleanText(step, `stage ${index + 1}`).slice(0, 120)
      }))
    }
  };
}

export function validateUnitySceneEnvelope(envelope = {}) {
  const errors = [];
  if (!envelope || typeof envelope !== "object") errors.push("Envelope must be an object.");
  if (envelope.protocol !== DEFAULT_PROTOCOL) errors.push("Unsupported Unity bridge protocol.");
  if (envelope.safety?.executeGeneratedCode !== false) errors.push("Runtime code execution must be disabled.");
  if (!Array.isArray(envelope.scene?.objects)) errors.push("scene.objects must be an array.");
  if (!Array.isArray(envelope.scene?.effects)) errors.push("scene.effects must be an array.");
  if ((envelope.scene?.objects || []).length > MAX_OBJECTS) errors.push(`Too many objects. Max ${MAX_OBJECTS}.`);
  if ((envelope.scene?.effects || []).length > MAX_EFFECTS) errors.push(`Too many effects. Max ${MAX_EFFECTS}.`);
  return {
    ok: errors.length === 0,
    errors
  };
}
