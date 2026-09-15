import type { Metadata } from "next";

import { LiveInnovationPortal } from "@/components/live-innovations/live-innovation-portal";

export const metadata: Metadata = {
  title: "Decision Signals | SciLoop",
  description: "Explore reviewed scientific signals with their source evidence, causal model, and conditional scenarios.",
  alternates: { canonical: "/live-innovations" },
};

export default function SciLoopLiveSignalsPage() {
  return <LiveInnovationPortal />;
}
