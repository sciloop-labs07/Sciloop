export type EvolutionMetrics = {
  views: number;
  reach: number;
  watchTimeSeconds: number;
  retention3s: number;
  averageRetention: number;
  completionRate: number;
  shares: number;
  saves: number;
  comments: number;
  likes: number;
  profileVisits: number;
  followersGained: number;
};

export type ReelExperiment = {
  id: string;
  createdAt: string;
  publishedAt?: string;
  discovery: string;
  knowledgeGraph: { domains: string[]; nodeCount: number; branchScore: number };
  story: { angle: string; hook: string; durationSeconds: number };
  creative: { visualStyle: string; narrationStyle: string; musicStyle: string; subtitleStyle: string; thumbnail: string; caption: string; targetAudience: string };
  publishingTime?: string;
  predicted: EvolutionMetrics;
  actual?: EvolutionMetrics;
  predictionError?: Partial<EvolutionMetrics>;
  analysis?: { type: "success" | "failure" | "mixed"; rootCauses: string[]; strengths: string[]; confidence: number };
};

export type LearningRule = { id: string; rule: string; evidence: string; sampleSize: number; lift: number; confidence: number; status: "supported" | "emerging"; createdAt: string };
export type EvolutionDatabase = { version: 1; updatedAt: string; experiments: ReelExperiment[]; rules: LearningRule[] };
export type EvolutionSnapshot = { metrics: { experiments: number; completedExperiments: number; predictionAccuracy: number; averageViralScore: number; averageCompletionRate: number; averageShareRate: number; averageSaveRate: number; improvementRate: number; knowledgeBaseSize: number; productionQualityTrend: number }; recent: ReelExperiment[]; rules: LearningRule[]; failures: ReelExperiment[]; successes: ReelExperiment[]; suggestions: string[] };

export const emptyMetrics: EvolutionMetrics = { views: 0, reach: 0, watchTimeSeconds: 0, retention3s: 0, averageRetention: 0, completionRate: 0, shares: 0, saves: 0, comments: 0, likes: 0, profileVisits: 0, followersGained: 0 };

const metricKeys: Array<keyof EvolutionMetrics> = ["views", "reach", "watchTimeSeconds", "retention3s", "averageRetention", "completionRate", "shares", "saves", "comments", "likes", "profileVisits", "followersGained"];
function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }
function rate(value: number, base: number) { return base ? (value / base) * 100 : 0; }

export function compareMetrics(predicted: EvolutionMetrics, actual: EvolutionMetrics): Partial<EvolutionMetrics> {
  return Object.fromEntries(metricKeys.map((key) => [key, Math.round((actual[key] - predicted[key]) * 100) / 100])) as Partial<EvolutionMetrics>;
}

export function analyzeExperiment(experiment: ReelExperiment) {
  if (!experiment.actual) return undefined;
  const predictedScore = (experiment.predicted.completionRate + rate(experiment.predicted.shares, Math.max(1, experiment.predicted.views)) * 100 + rate(experiment.predicted.saves, Math.max(1, experiment.predicted.views)) * 100) / 3;
  const actualScore = (experiment.actual.completionRate + rate(experiment.actual.shares, Math.max(1, experiment.actual.views)) * 100 + rate(experiment.actual.saves, Math.max(1, experiment.actual.views)) * 100) / 3;
  const delta = actualScore - predictedScore;
  const rootCauses = delta < -8 ? [experiment.predicted.retention3s > experiment.actual.retention3s + 8 ? "Hook overestimated attention" : "Opening drop-off exceeded simulation", experiment.predicted.averageRetention > experiment.actual.averageRetention + 8 ? "Pacing or explanation was too slow" : "Narrative clarity needs review", experiment.actual.shares < experiment.predicted.shares * 0.7 ? "Share trigger was weaker than expected" : "Publishing context may have limited reach"] : [];
  const strengths = delta >= 8 ? [experiment.actual.retention3s > experiment.predicted.retention3s ? "Hook outperformed simulation" : "Opening matched expectation", experiment.actual.shares > experiment.predicted.shares ? "Share behavior beat prediction" : "Audience response was stronger than forecast", experiment.actual.saves > experiment.predicted.saves ? "Educational value created saves" : "Creative fit was strong"] : [];
  return { type: delta >= 8 ? "success" as const : delta <= -8 ? "failure" as const : "mixed" as const, rootCauses, strengths, confidence: clamp(65 + Math.abs(delta)) };
}

export function discoverLearningRules(experiments: ReelExperiment[]): LearningRule[] {
  const completed = experiments.filter((experiment) => experiment.actual && experiment.analysis);
  if (completed.length < 3) return [];
  const groups = new Map<string, ReelExperiment[]>();
  for (const experiment of completed) {
    const key = `style:${experiment.creative.visualStyle}`;
    groups.set(key, [...(groups.get(key) ?? []), experiment]);
  }
  return [...groups.entries()].flatMap(([key, items]) => {
    if (items.length < 3) return [];
    const performance = items.reduce((sum, item) => sum + (item.actual?.completionRate ?? 0), 0) / items.length;
    const baseline = completed.reduce((sum, item) => sum + (item.actual?.completionRate ?? 0), 0) / completed.length;
    const lift = performance - baseline;
    if (lift < 4) return [];
    return [{ id: key, rule: `${key.replace("style:", "Visual style ")} improves completion rate when paired with a clear mechanism.`, evidence: `${items.length} completed experiments averaged ${Math.round(performance)}% completion versus ${Math.round(baseline)}% baseline.`, sampleSize: items.length, lift: Math.round(lift * 10) / 10, confidence: clamp(70 + items.length * 4 + lift), status: items.length >= 5 ? "supported" as const : "emerging" as const, createdAt: new Date().toISOString() }];
  });
}

export function buildEvolutionSnapshot(database: EvolutionDatabase): EvolutionSnapshot {
  const completed = database.experiments.filter((experiment) => experiment.actual);
  const accuracy = completed.length ? clamp(100 - completed.reduce((sum, item) => sum + metricKeys.reduce((metricSum, key) => metricSum + Math.abs(item.predictionError?.[key] ?? 0), 0) / metricKeys.length, 0) / completed.length) : 0;
  const avg = (key: keyof EvolutionMetrics) => completed.length ? Math.round(completed.reduce((sum, item) => sum + (item.actual?.[key] ?? 0), 0) / completed.length) : 0;
  const quality = completed.length >= 2 ? clamp(50 + (avg("completionRate") - (completed[0].actual?.completionRate ?? avg("completionRate")))) : 0;
  const failures = completed.filter((item) => item.analysis?.type === "failure");
  const successes = completed.filter((item) => item.analysis?.type === "success");
  return { metrics: { experiments: database.experiments.length, completedExperiments: completed.length, predictionAccuracy: accuracy, averageViralScore: avg("averageRetention"), averageCompletionRate: avg("completionRate"), averageShareRate: avg("shares"), averageSaveRate: avg("saves"), improvementRate: quality, knowledgeBaseSize: database.rules.length, productionQualityTrend: quality }, recent: database.experiments.slice(-8).reverse(), rules: database.rules, failures: failures.slice(-5).reverse(), successes: successes.slice(-5).reverse(), suggestions: completed.length < 3 ? ["Import at least 3 completed reels before promoting a pattern to a learning rule.", "Keep predicted and actual metrics in the same units."] : failures.length ? [...new Set(failures.flatMap((item) => item.analysis?.rootCauses ?? []))].slice(0, 4) : ["The current evidence is stable. Continue collecting varied audiences and styles."] };
}
