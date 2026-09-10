export type CapabilityStatus = "workbench" | "candidate" | "public" | "retired-but-preserved";

export type SciLoopCapability = { id: string; label: string; status: CapabilityStatus; path: string };

export const capabilities: SciLoopCapability[] = [
  { id: "public-signal", label: "Reviewed signal launch", status: "public", path: "/sciloop-live" },
  { id: "public-html-portal", label: "Preserved HTML public portal", status: "public", path: "/sciloop-live" },
  { id: "live-innovations", label: "Decision signals", status: "public", path: "/live-innovations" },
  { id: "workbench", label: "Unified workbench", status: "workbench", path: "/workbench" },
  { id: "visual-language", label: "Visual language", status: "workbench", path: "/visual-language" },
  { id: "physics-visual-language", label: "Physics visual language", status: "public", path: "/sciloop-live/physics" },
  { id: "experiment-lab", label: "Cognitive experiment lab", status: "workbench", path: "/mini-experiment-lab" },
  { id: "legacy-shell", label: "Legacy visual shell", status: "retired-but-preserved", path: "/sciloop-live" },
];

export const workbenchPrefixes = [
  "/workbench", "/visual-language", "/visual-language-lab", "/visual-frontier", "/mini-experiment-lab",
  "/simulation-lab", "/director", "/content-studio", "/evolution", "/knowledge-graph", "/impact-hub",
  "/local-problem-solver", "/platform-guide", "/potential-explorer", "/timeless-problems", "/cosmic-simulation",
  "/unity-ai-sandbox", "/worlds", "/system-status", "/internal",
];

export function isWorkbenchPath(pathname: string) {
  return workbenchPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
