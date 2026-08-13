import type { Metadata } from "next";

import { getInnovation } from "@/data/innovations";
import { InnovationExplorer } from "@/components/innovations/innovation-explorer";
import { notFound } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function fallbackInnovation(slug: string, params: Record<string, string | string[] | undefined>) {
  const title = first(params.title);
  if (!title) return undefined;
  return {
    slug,
    title,
    field: "Live innovation",
    date: "Live today",
    source: first(params.source) ?? "Live news signal",
    summary: first(params.summary) ?? "This live signal has been collected from the innovation stream. Explore the mechanism, context, people, and future questions as the story develops.",
    facts: ["This story was collected from the live innovation feed", "Evidence and interpretation should be kept distinct", "Follow the source for the latest development"],
    mechanism: "SciLoop is assembling the available context around this signal. Ask AI a specific question to turn the headline into a more useful investigation.",
    scientists: [],
    organizations: [],
    timeline: [{ year: "Today", label: "Live signal", detail: "This innovation entered the SciLoop stream." }],
    technology: [{ label: "Source context", detail: first(params.source) ?? "Live news signal" }],
    related: ["Explore related breakthroughs", "Ask a better question"],
    futures: [{ label: "Best case", detail: "The signal develops into a meaningful improvement or breakthrough.", tone: "positive" as const }, { label: "Caution", detail: "Early claims may change as evidence accumulates.", tone: "caution" as const }, { label: "Open question", detail: "What should we investigate next?", tone: "open" as const }],
  };
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }): Promise<Metadata> {
  const { slug } = await params;
  const innovation = getInnovation(slug) ?? fallbackInnovation(slug, await searchParams);
  return { title: innovation ? `${innovation.title} | SciLoop` : "Innovation | SciLoop", description: innovation?.summary };
}

export default async function InnovationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }) {
  const { slug } = await params;
  const innovation = getInnovation(slug) ?? fallbackInnovation(slug, await searchParams);
  if (!innovation) notFound();
  return <InnovationExplorer innovation={innovation} />;
}
