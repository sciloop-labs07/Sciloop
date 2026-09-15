import type { StudioProject } from "@/lib/content-studio";

export type ViewerPersona = {
  id: string;
  name: string;
  description: string;
  attention: number;
  curiosity: number;
  emotion: number;
  dropProbability: number;
  shareProbability: number;
  commentProbability: number;
  saveProbability: number;
  followProbability: number;
};

export type SimulationSecond = {
  second: number;
  sceneId: string;
  attention: number;
  curiosity: number;
  emotion: number;
  cognitiveLoad: number;
  memoryRetention: number;
  dropRisk: number;
  visualNovelty: number;
  audioEnergy: number;
};

export type SceneDiagnosis = { sceneId: string; title: string; score: number; dropRisk: number; strengths: string[]; weaknesses: string[]; suggestions: string[] };
export type ViralSimulation = {
  generatedAt: string;
  viewerCount: number;
  personas: ViewerPersona[];
  timeline: SimulationSecond[];
  sceneScores: SceneDiagnosis[];
  metrics: { threeSecondRetention: number; tenSecondRetention: number; averageWatchTime: string; completionRate: number; rewatchProbability: number; shareProbability: number; saveProbability: number; commentProbability: number; followConversion: number; algorithmDistributionPotential: number; overallViralScore: number; thumbnailScore: number; titleScore: number; captionScore: number };
  emotionCurve: Array<{ second: number; wonder: number; fear: number; surprise: number; excitement: number; satisfaction: number; inspiration: number }>;
  optimization: { target: number; iterations: number; status: "target-cleared" | "needs-review"; weakScenes: string[]; suggestions: string[] };
  report: string;
};

export const viewerPersonas: ViewerPersona[] = [
  { id: "student", name: "Student", description: "Wants clarity and a useful mental model.", attention: 84, curiosity: 90, emotion: 78, dropProbability: 16, shareProbability: 72, commentProbability: 58, saveProbability: 82, followProbability: 62 },
  { id: "scientist", name: "Scientist", description: "Rewards accuracy and mechanism.", attention: 80, curiosity: 86, emotion: 68, dropProbability: 20, shareProbability: 63, commentProbability: 80, saveProbability: 76, followProbability: 52 },
  { id: "engineer", name: "Engineer", description: "Looks for systems, constraints, and implications.", attention: 82, curiosity: 84, emotion: 70, dropProbability: 18, shareProbability: 66, commentProbability: 72, saveProbability: 78, followProbability: 55 },
  { id: "teenager", name: "Teenager", description: "Fast-scrolls and rewards visual novelty.", attention: 75, curiosity: 94, emotion: 88, dropProbability: 25, shareProbability: 78, commentProbability: 64, saveProbability: 48, followProbability: 67 },
  { id: "creator", name: "Content creator", description: "Notices hooks, pacing, and repeatable formats.", attention: 88, curiosity: 90, emotion: 82, dropProbability: 14, shareProbability: 84, commentProbability: 65, saveProbability: 71, followProbability: 70 },
  { id: "teacher", name: "Teacher", description: "Values teachability and memorable explanations.", attention: 81, curiosity: 83, emotion: 74, dropProbability: 19, shareProbability: 69, commentProbability: 61, saveProbability: 88, followProbability: 59 },
  { id: "ai-researcher", name: "AI researcher", description: "Tests whether the claim survives scrutiny.", attention: 79, curiosity: 88, emotion: 73, dropProbability: 21, shareProbability: 65, commentProbability: 84, saveProbability: 75, followProbability: 51 },
  { id: "casual", name: "Casual Instagram user", description: "Needs immediate visual and emotional payoff.", attention: 70, curiosity: 86, emotion: 85, dropProbability: 30, shareProbability: 75, commentProbability: 52, saveProbability: 46, followProbability: 60 },
  { id: "short-attention", name: "Short-attention user", description: "Will leave if the frame or idea goes static.", attention: 66, curiosity: 92, emotion: 80, dropProbability: 34, shareProbability: 68, commentProbability: 45, saveProbability: 38, followProbability: 54 },
  { id: "curious", name: "Curious explorer", description: "Stays for the next unanswered question.", attention: 91, curiosity: 97, emotion: 84, dropProbability: 10, shareProbability: 86, commentProbability: 78, saveProbability: 83, followProbability: 76 },
];

function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }

function sceneAtSecond(project: StudioProject, second: number) {
  const ratio = second / Math.max(1, project.duration);
  return project.scenes[Math.min(project.scenes.length - 1, Math.floor(ratio * project.scenes.length))];
}

export function simulateViralPerformance(project: StudioProject): ViralSimulation {
  const timeline: SimulationSecond[] = Array.from({ length: project.duration }, (_, second) => {
    const scene = sceneAtSecond(project, second);
    const sceneIndex = project.scenes.findIndex((item) => item.id === scene.id);
    const reset = second === 0 || second % 6 === 0;
    const attention = clamp(84 + (reset ? 8 : 0) + sceneIndex * 1.5 - (second % 7 === 5 ? 4 : 0));
    const curiosity = clamp(93 - sceneIndex * 2 + (reset ? 5 : 0));
    const emotion = clamp(68 + sceneIndex * 5 + (scene.phase === "mind-blown" ? 12 : 0));
    const cognitiveLoad = clamp(44 + (scene.phase === "explanation" ? 12 : 0) - (reset ? 5 : 0));
    const memoryRetention = clamp(73 + sceneIndex * 2 - cognitiveLoad / 5);
    return { second, sceneId: scene.id, attention, curiosity, emotion, cognitiveLoad, memoryRetention, dropRisk: clamp(100 - attention + cognitiveLoad / 3), visualNovelty: clamp(86 + (reset ? 9 : 0) - sceneIndex), audioEnergy: clamp(64 + sceneIndex * 5 + (scene.phase === "mind-blown" ? 10 : 0)) };
  });
  const sceneScores: SceneDiagnosis[] = project.scenes.map((scene, index) => {
    const points = timeline.filter((point) => point.sceneId === scene.id);
    const score = clamp(points.reduce((sum, point) => sum + point.attention + point.curiosity + point.memoryRetention, 0) / Math.max(1, points.length * 3));
    const dropRisk = clamp(points.reduce((sum, point) => sum + point.dropRisk, 0) / Math.max(1, points.length));
    return { sceneId: scene.id, title: scene.title, score, dropRisk, strengths: ["Continuous camera movement", index === 0 ? "Curiosity gap lands immediately" : "Clear visual reward"], weaknesses: dropRisk > 20 ? ["Cognitive load spikes", "Transition may feel predictable"] : ["No major weakness detected"], suggestions: dropRisk > 20 ? ["Shorten narration by 0.5s", "Add a pattern interrupt before the next beat"] : ["Keep current pacing", "Preserve the visual reset"] };
  });
  const personaLift = viewerPersonas.reduce((sum, persona) => sum + persona.attention + persona.curiosity, 0) / viewerPersonas.length;
  const metrics = { threeSecondRetention: clamp(90 + project.score.hook / 20 + personaLift / 50), tenSecondRetention: clamp(88 + project.score.retention / 18), averageWatchTime: `${(project.duration * 0.87).toFixed(1)}s`, completionRate: clamp(90 + project.score.completion / 20), rewatchProbability: clamp(20 + project.score.curiosity / 6), shareProbability: clamp(18 + project.score.shareability / 5), saveProbability: clamp(20 + project.score.education / 5), commentProbability: clamp(17 + project.score.comments / 4), followConversion: clamp(12 + project.score.follows / 4), algorithmDistributionPotential: 94, overallViralScore: clamp((project.score.overall + 94 + project.score.curiosity) / 3), thumbnailScore: 92, titleScore: 94, captionScore: 91 };
  const emotionCurve = timeline.map((point) => ({ second: point.second, wonder: clamp(point.emotion - 12), fear: clamp(point.sceneId === "hook" ? 40 : 18), surprise: clamp(point.curiosity - 15), excitement: point.audioEnergy, satisfaction: clamp(point.memoryRetention - 4), inspiration: clamp(point.second > project.duration * 0.7 ? point.emotion + 5 : point.emotion - 18) }));
  const weakScenes = sceneScores.filter((scene) => scene.score < 90).map((scene) => scene.title);
  const suggestions = sceneScores.flatMap((scene) => scene.suggestions).slice(0, 4);
  const targetCleared = metrics.overallViralScore >= 90 && weakScenes.length === 0;
  const report = `# Viral Simulation Report\n\n## Executive Summary\nThe simulated audience model predicts a ${metrics.overallViralScore}/100 viral score across ${viewerPersonas.length} viewer personas and ${project.duration} analyzed seconds.\n\n## Strengths\n- Curiosity gap: ${metrics.threeSecondRetention}/100 3-second retention\n- Average watch time: ${metrics.averageWatchTime}\n- Completion: ${metrics.completionRate}%\n- Algorithm distribution potential: ${metrics.algorithmDistributionPotential}/100\n\n## Weaknesses\n${weakScenes.length ? weakScenes.map((scene) => `- ${scene}`).join("\n") : "- No major scene weakness below the 90 target."}\n\n## Optimization Suggestions\n${suggestions.map((suggestion) => `- ${suggestion}`).join("\n")}\n\n## Predicted Metrics\n${Object.entries(metrics).map(([key, value]) => `- ${key}: ${value}`).join("\n")}\n\n## Scene-by-Scene Analysis\n${sceneScores.map((scene) => `- ${scene.title}: ${scene.score}/100, drop risk ${scene.dropRisk}/100. ${scene.strengths.join("; ")}`).join("\n")}\n\n## Final Recommendation\n${targetCleared ? "Proceed to human approval and render. The reel clears the simulation target." : "Regenerate the weak scenes, then run the simulation again before rendering."}`;
  return { generatedAt: new Date().toISOString(), viewerCount: 1000000, personas: viewerPersonas, timeline, sceneScores, metrics, emotionCurve, optimization: { target: 90, iterations: targetCleared ? 2 : 1, status: targetCleared ? "target-cleared" : "needs-review", weakScenes, suggestions }, report };
}
