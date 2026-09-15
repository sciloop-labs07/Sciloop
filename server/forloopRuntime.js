import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const RUNTIME_LOG_LIMIT = 400;
const PROCESS_OUTPUT_LIMIT = 220;
const runtimeLogs = [];
const managedProcesses = new Map();

function nowIso() {
  return new Date().toISOString();
}

function clip(value, max = 1200) {
  return String(value || "").replace(/\s+$/g, "").slice(0, max);
}

function pushRuntimeLog(level, source, message) {
  runtimeLogs.unshift({
    level,
    source,
    message: clip(message),
    timestamp: nowIso(),
  });
  if (runtimeLogs.length > RUNTIME_LOG_LIMIT) {
    runtimeLogs.length = RUNTIME_LOG_LIMIT;
  }
}

function npmCommand() {
  return process.platform === "win32" ? "cmd.exe" : "npm";
}

function npmArgs(...args) {
  return process.platform === "win32" ? ["/d", "/s", "/c", "npm", ...args] : args;
}

function taskkillCommand() {
  return process.platform === "win32" ? "taskkill.exe" : null;
}

function buildTargets({ projectRoot, backendPort }) {
  const sciloopHtmlPath = path.join(projectRoot, "SciLoop - Live Scientific Discoveries 80.html");
  return [
    {
      id: "sciloop-frontend",
      name: "SciLoop Frontend Dev Server",
      type: "process",
      purpose: "Runs the user-facing SciLoop Next.js frontend.",
      cwd: projectRoot,
      command: npmCommand(),
      args: npmArgs("run", "dev"),
      url: "http://localhost:3000",
      startable: true,
      stoppable: true,
      restartable: true,
    },
    {
      id: "forloop-control-api",
      name: "ForLoop Control API",
      type: "anchor",
      purpose: "Keeps the browser control panel, runtime endpoints, logs, and safe admin tools online.",
      cwd: path.join(projectRoot, "server"),
      command: "node",
      args: ["index.js"],
      url: `http://localhost:${backendPort}`,
      startable: false,
      stoppable: false,
      restartable: false,
    },
    {
      id: "sciloop-ai-backend",
      name: "SciLoop News AI Backend",
      type: "process",
      purpose: "Runs the local News Portal AI API expected by the standalone SciLoop HTML.",
      cwd: path.join(projectRoot, "sciloop-backend"),
      command: npmCommand(),
      args: npmArgs("run", "start"),
      url: "http://localhost:5050/health",
      startable: true,
      stoppable: true,
      restartable: true,
    },
    {
      id: "sciloop-uploaded-html",
      name: "Uploaded SciLoop HTML Artifact",
      type: "file",
      purpose: "Tracks the uploaded standalone SciLoop HTML file for future wiring into runtime flows.",
      filePath: sciloopHtmlPath,
      url: `http://localhost:${backendPort}/sciloop-live-file`,
      startable: false,
      stoppable: false,
      restartable: false,
    },
  ];
}

async function probeUrl(url, timeoutMs = 1500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });
    return {
      reachable: true,
      statusCode: response.status,
      ok: response.ok,
    };
  } catch (error) {
    return {
      reachable: false,
      statusCode: null,
      ok: false,
      error: error?.name === "AbortError" ? "timeout" : "unreachable",
    };
  } finally {
    clearTimeout(timer);
  }
}

function getManagedEntry(targetId) {
  const entry = managedProcesses.get(targetId);
  if (!entry) return null;
  if (entry.process.exitCode !== null || entry.process.killed) {
    return null;
  }
  return entry;
}

async function describeTarget(target) {
  const managed = getManagedEntry(target.id);

  if (target.type === "anchor") {
    return {
      ...publicTarget(target),
      status: "online",
      managed: true,
      canStart: false,
      canStop: false,
      canRestart: false,
      lastChecked: nowIso(),
      message: "ForLoop Control API is the current control anchor. It cannot safely stop itself.",
    };
  }

  if (target.type === "file") {
    const exists = existsSync(target.filePath);
    return {
      ...publicTarget(target),
      status: exists ? "ready" : "missing",
      managed: false,
      canStart: false,
      canStop: false,
      canRestart: false,
      lastChecked: nowIso(),
      message: exists ? "Uploaded SciLoop HTML file detected." : "Uploaded SciLoop HTML file is missing.",
    };
  }

  if (managed) {
    return {
      ...publicTarget(target),
      status: "running",
      managed: true,
      canStart: false,
      canStop: true,
      canRestart: true,
      pid: managed.process.pid,
      startedAt: managed.startedAt,
      lastChecked: nowIso(),
      message: "Process is running under ForLoop control.",
    };
  }

  const probe = await probeUrl(target.url);
  if (probe.reachable) {
    return {
      ...publicTarget(target),
      status: "external_online",
      managed: false,
      canStart: false,
      canStop: false,
      canRestart: false,
      lastChecked: nowIso(),
      message: "Service is reachable, but it was not started by ForLoop. Stop it from the terminal that launched it.",
    };
  }

  return {
    ...publicTarget(target),
    status: "stopped",
    managed: false,
    canStart: target.startable,
    canStop: false,
    canRestart: false,
    lastChecked: nowIso(),
    message: "Service is not reachable. ForLoop can start it as an allowlisted local process.",
  };
}

function publicTarget(target) {
  return {
    id: target.id,
    name: target.name,
    type: target.type,
    purpose: target.purpose,
    url: target.url,
    commandLabel: target.command ? `${target.command} ${target.args.join(" ")}` : "not applicable",
  };
}

function appendProcessOutput(targetId, level, chunk) {
  const entry = managedProcesses.get(targetId);
  if (!entry) return;
  const lines = String(chunk || "")
    .split(/\r?\n/)
    .map((line) => clip(line, 1000))
    .filter(Boolean);

  for (const line of lines) {
    const item = {
      level,
      source: targetId,
      message: line,
      timestamp: nowIso(),
    };
    entry.output.unshift(item);
    runtimeLogs.unshift(item);
  }

  if (entry.output.length > PROCESS_OUTPUT_LIMIT) {
    entry.output.length = PROCESS_OUTPUT_LIMIT;
  }
  if (runtimeLogs.length > RUNTIME_LOG_LIMIT) {
    runtimeLogs.length = RUNTIME_LOG_LIMIT;
  }
}

export async function getRuntimeStatus(config) {
  const targets = buildTargets(config);
  const described = [];
  for (const target of targets) {
    described.push(await describeTarget(target));
  }
  return {
    mode: "local_runtime_control",
    warning: "ForLoop exposes only allowlisted local runtime actions, not a raw terminal.",
    targets: described,
    timestamp: nowIso(),
  };
}

export async function startRuntimeTarget(config, targetId) {
  const target = buildTargets(config).find((item) => item.id === targetId);
  if (!target) {
    throw new Error("Unknown runtime target.");
  }
  if (!target.startable || target.type !== "process") {
    throw new Error("This runtime target cannot be started from ForLoop.");
  }
  if (getManagedEntry(target.id)) {
    pushRuntimeLog("info", target.id, `${target.name} is already running under ForLoop control.`);
    return describeTarget(target);
  }

  const probe = await probeUrl(target.url);
  if (probe.reachable) {
    pushRuntimeLog("warn", target.id, `${target.name} is already reachable outside ForLoop control.`);
    return describeTarget(target);
  }

  const child = spawn(target.command, target.args, {
    cwd: target.cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  managedProcesses.set(target.id, {
    process: child,
    output: [],
    startedAt: nowIso(),
  });

  pushRuntimeLog("action", target.id, `Started ${target.name}.`);

  child.stdout.on("data", (chunk) => appendProcessOutput(target.id, "info", chunk));
  child.stderr.on("data", (chunk) => appendProcessOutput(target.id, "warn", chunk));
  child.on("exit", (code, signal) => {
    pushRuntimeLog("warn", target.id, `${target.name} exited with code ${code ?? "none"} and signal ${signal ?? "none"}.`);
    managedProcesses.delete(target.id);
  });
  child.on("error", (error) => {
    pushRuntimeLog("error", target.id, `${target.name} failed to start: ${clip(error.message, 500)}`);
    managedProcesses.delete(target.id);
  });

  return describeTarget(target);
}

export async function stopRuntimeTarget(config, targetId) {
  const target = buildTargets(config).find((item) => item.id === targetId);
  if (!target) {
    throw new Error("Unknown runtime target.");
  }
  if (!target.stoppable || target.type !== "process") {
    throw new Error("This runtime target cannot be stopped from ForLoop.");
  }

  const entry = getManagedEntry(target.id);
  if (!entry) {
    throw new Error("ForLoop can only stop processes it started.");
  }

  pushRuntimeLog("action", target.id, `Stop requested for ${target.name}.`);

  if (process.platform === "win32") {
    const killer = spawn(taskkillCommand(), ["/pid", String(entry.process.pid), "/t", "/f"], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    killer.stdout.on("data", (chunk) => appendProcessOutput(target.id, "info", chunk));
    killer.stderr.on("data", (chunk) => appendProcessOutput(target.id, "warn", chunk));
  } else {
    entry.process.kill("SIGTERM");
  }

  return describeTarget(target);
}

export async function restartRuntimeTarget(config, targetId) {
  try {
    await stopRuntimeTarget(config, targetId);
  } catch (error) {
    if (!/only stop processes it started/i.test(error.message)) {
      throw error;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  return startRuntimeTarget(config, targetId);
}

export function getRuntimeLogs(targetId = "all") {
  if (targetId === "all") {
    return runtimeLogs.slice(0, RUNTIME_LOG_LIMIT);
  }
  const entry = managedProcesses.get(targetId);
  if (entry) {
    return entry.output.slice(0, PROCESS_OUTPUT_LIMIT);
  }
  return runtimeLogs.filter((item) => item.source === targetId).slice(0, PROCESS_OUTPUT_LIMIT);
}
