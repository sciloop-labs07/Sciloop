export type SciLoopStage = "explore" | "understand" | "experiment" | "solve";
export type SciLoopArtifactKind =
  | "question"
  | "evidence-set"
  | "semantic-model"
  | "visual-explanation"
  | "simulation-run"
  | "decision-plan";

export type SciLoopArtifact = {
  id: string;
  kind: SciLoopArtifactKind;
  title: string;
  summary: string;
  sourcePortal: string;
  status: "draft" | "ready" | "complete";
  createdAt: string;
};

export type SciLoopProject = {
  id: string;
  title: string;
  intent: string;
  currentStage: SciLoopStage;
  nextAction: string;
  artifacts: SciLoopArtifact[];
  createdAt: string;
  updatedAt: string;
};

const projectStorageKey = "sciloop-active-project-v1";

export const workflowStages: Array<{
  id: SciLoopStage;
  label: string;
  description: string;
  artifact: SciLoopArtifactKind;
}> = [
  { id: "explore", label: "Explore", description: "Collect context and evidence.", artifact: "evidence-set" },
  { id: "understand", label: "Understand", description: "Build the mechanism and visual model.", artifact: "visual-explanation" },
  { id: "experiment", label: "Experiment", description: "Change variables and observe consequences.", artifact: "simulation-run" },
  { id: "solve", label: "Solve", description: "Turn understanding into a decision or action.", artifact: "decision-plan" },
];

export function createSciLoopProject(intent: string): SciLoopProject {
  const now = new Date().toISOString();
  const cleanIntent = intent.trim() || "A new scientific question";
  return {
    id: `project-${Date.now()}`,
    title: cleanIntent,
    intent: cleanIntent,
    currentStage: "explore",
    nextAction: "Collect the strongest context and evidence for this question.",
    artifacts: [{
      id: `question-${Date.now()}`,
      kind: "question",
      title: "Starting question",
      summary: cleanIntent,
      sourcePortal: "workbench",
      status: "complete",
      createdAt: now,
    }],
    createdAt: now,
    updatedAt: now,
  };
}

export function advanceSciLoopProject(project: SciLoopProject): SciLoopProject {
  const stageIndex = workflowStages.findIndex((stage) => stage.id === project.currentStage);
  const current = workflowStages[stageIndex];
  const next = workflowStages[Math.min(stageIndex + 1, workflowStages.length - 1)];
  const now = new Date().toISOString();
  const artifactExists = project.artifacts.some((artifact) => artifact.kind === current.artifact);
  const artifacts = artifactExists ? project.artifacts : [...project.artifacts, {
    id: `${current.artifact}-${Date.now()}`,
    kind: current.artifact,
    title: `${current.label} artifact`,
    summary: current.description,
    sourcePortal: project.currentStage,
    status: "ready" as const,
    createdAt: now,
  }];

  return {
    ...project,
    currentStage: next.id,
    nextAction: next.id === project.currentStage
      ? "This workflow is ready to become a saved project or a new investigation."
      : next.description,
    artifacts,
    updatedAt: now,
  };
}

export function saveSciLoopProject(project: SciLoopProject) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(projectStorageKey, JSON.stringify(project));
}

export function loadSciLoopProject(): SciLoopProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(projectStorageKey);
    return raw ? JSON.parse(raw) as SciLoopProject : null;
  } catch {
    return null;
  }
}
