import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { analyzeExperiment, buildEvolutionSnapshot, compareMetrics, discoverLearningRules, type EvolutionDatabase, type EvolutionSnapshot, type ReelExperiment } from "@/lib/evolution-engine";

const filePath = path.join(process.cwd(), "data", "evolution", "evolution_database.json");
const rulesPath = path.join(process.cwd(), "data", "evolution", "learning_rules.json");
const reportsRoot = path.join(process.cwd(), "data", "evolution");

const blankDatabase = (): EvolutionDatabase => ({ version: 1, updatedAt: new Date().toISOString(), experiments: [], rules: [] });
async function ensureDatabase() { try { return JSON.parse(await fs.readFile(filePath, "utf8")) as EvolutionDatabase; } catch { const database = blankDatabase(); await persist(database); return database; } }
async function persist(database: EvolutionDatabase) { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, JSON.stringify(database, null, 2), "utf8"); await fs.writeFile(rulesPath, JSON.stringify(database.rules, null, 2), "utf8"); }
async function persistReports(database: EvolutionDatabase) {
  const completed = database.experiments.filter((experiment) => experiment.analysis);
  await Promise.all(["failure_reports", "success_reports", "optimization_history"].map((folder) => fs.mkdir(path.join(reportsRoot, folder), { recursive: true })));
  for (const experiment of completed) {
    const analysis = experiment.analysis;
    if (!analysis) continue;
    const report = `# ${analysis.type === "success" ? "Success" : "Failure"} Report\n\nReel: ${experiment.discovery}\n\nConfidence: ${analysis.confidence}%\n\n## Root causes\n${analysis.rootCauses.map((item) => `- ${item}`).join("\n") || "- None identified"}\n\n## Strengths\n${analysis.strengths.map((item) => `- ${item}`).join("\n") || "- None identified"}`;
    const folder = analysis.type === "success" ? "success_reports" : "failure_reports";
    await fs.writeFile(path.join(reportsRoot, folder, `${experiment.id}.md`), report, "utf8");
    await fs.writeFile(path.join(reportsRoot, "optimization_history", `${experiment.id}.md`), `# Optimization History\n\nPrediction error:\n\n${Object.entries(experiment.predictionError ?? {}).map(([key, value]) => `- ${key}: ${value}`).join("\n")}`, "utf8");
  }
  const snapshot = buildEvolutionSnapshot(database);
  await fs.writeFile(path.join(reportsRoot, "weekly_evolution_report.md"), `# Weekly Evolution Report\n\nExperiments: ${snapshot.metrics.experiments}\nCompleted: ${snapshot.metrics.completedExperiments}\nPrediction accuracy: ${snapshot.metrics.predictionAccuracy}%\nAverage completion: ${snapshot.metrics.averageCompletionRate}%\nKnowledge base size: ${snapshot.metrics.knowledgeBaseSize}\n\n## Suggestions\n${snapshot.suggestions.map((item) => `- ${item}`).join("\n")}`, "utf8");
}

export async function getEvolutionSnapshot(): Promise<EvolutionSnapshot> { const database = await ensureDatabase(); return buildEvolutionSnapshot(database); }
export async function recordEvolutionExperiment(input: Omit<ReelExperiment, "id" | "createdAt" | "predictionError" | "analysis">): Promise<EvolutionSnapshot> { const database = await ensureDatabase(); const experiment: ReelExperiment = { ...input, id: `experiment-${Date.now()}`, createdAt: new Date().toISOString() }; if (experiment.actual) { experiment.predictionError = compareMetrics(experiment.predicted, experiment.actual); experiment.analysis = analyzeExperiment(experiment); } database.experiments.push(experiment); database.rules = discoverLearningRules(database.experiments); database.updatedAt = new Date().toISOString(); await persist(database); await persistReports(database); return buildEvolutionSnapshot(database); }
