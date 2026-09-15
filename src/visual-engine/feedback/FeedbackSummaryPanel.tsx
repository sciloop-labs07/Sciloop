import { analyzeFeedback } from "./feedbackAnalyzer";
import type { VisualFeedback } from "./feedback.types";
import { humanizeFeedbackValue } from "./feedbackUtils";

interface FeedbackSummaryPanelProps {
  feedbackList: VisualFeedback[];
}

function topPerformance(feedbackList: VisualFeedback[], key: "patternId" | "engineId") {
  const groups = feedbackList.reduce<Record<string, { total: number; count: number }>>((result, feedback) => {
    const id = feedback[key];
    const current = result[id] ?? { total: 0, count: 0 };
    result[id] = { total: current.total + feedback.clarityScore, count: current.count + 1 };
    return result;
  }, {});

  return Object.entries(groups)
    .map(([id, value]) => ({ id, average: Math.round((value.total / value.count) * 10) / 10, count: value.count }))
    .sort((a, b) => b.average - a.average || b.count - a.count)[0];
}

export function FeedbackSummaryPanel({ feedbackList }: FeedbackSummaryPanelProps) {
  const { summary } = analyzeFeedback(feedbackList);
  const topPattern = topPerformance(feedbackList, "patternId");
  const topEngine = topPerformance(feedbackList, "engineId");

  const metrics = [
    ["Feedback", summary.totalCount.toString()],
    ["Avg clarity", `${summary.averageClarity}/5`],
    ["Avg usefulness", `${summary.averageUsefulness}/5`],
    ["Common issue", summary.mostCommonIssue ? humanizeFeedbackValue(summary.mostCommonIssue) : "None yet"],
    ["Top request", summary.mostRequestedImprovement ? humanizeFeedbackValue(summary.mostRequestedImprovement) : "None yet"],
    ["Pattern performance", topPattern ? `${humanizeFeedbackValue(topPattern.id)} ${topPattern.average}/5` : "No data"],
    ["Engine performance", topEngine ? `${humanizeFeedbackValue(topEngine.id)} ${topEngine.average}/5` : "No data"],
  ];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/80">Local clarity summary</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Feedback signals</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
