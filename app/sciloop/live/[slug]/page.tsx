import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnovationExplorer } from "@/components/innovations/innovation-explorer";
import { getInnovation, innovations } from "@/data/innovations";

interface InnovationPageProps {
  params: Promise<{ slug: string }>;
}

// The public experience intentionally exposes only the reviewed local signal
// set. Pre-rendering those paths also guarantees the canary URLs are included
// in the Vercel production route manifest.
export function generateStaticParams() {
  return innovations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: InnovationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const innovation = getInnovation(slug);

  if (!innovation) return { title: "Signal not found | SciLoop" };

  return {
    title: `${innovation.title} | SciLoop`,
    description: innovation.summary,
    alternates: { canonical: `/sciloop/live/${innovation.slug}` },
  };
}

export default async function SciLoopInnovationPage({ params }: InnovationPageProps) {
  const { slug } = await params;
  const innovation = getInnovation(slug);

  if (!innovation) notFound();

  return <InnovationExplorer innovation={innovation} />;
}
