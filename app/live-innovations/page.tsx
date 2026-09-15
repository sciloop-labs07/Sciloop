import type { Metadata } from "next";

import { LiveInnovationPortal } from "@/components/live-innovations/live-innovation-portal";
import { getInnovation } from "@/data/innovations";

export const metadata: Metadata = {
  title: "Decision Signals | SciLoop",
  description: "Review scientific signals through source evidence, causal models, conditional scenarios, and next research actions.",
};

export default async function LiveInnovationsPage({ searchParams }: { searchParams: Promise<{ signal?: string | string[] }> }) {
  const params = await searchParams;
  const signal = Array.isArray(params.signal) ? params.signal[0] : params.signal;
  return <LiveInnovationPortal selectedInnovation={signal ? getInnovation(signal) : undefined} />;
}
