import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnovationExplorer } from "@/components/innovations/innovation-explorer";
import { getInnovation } from "@/data/innovations";

const innovation = getInnovation("crispr-gene-editing");

export const metadata: Metadata = innovation
  ? { title: `${innovation.title} | SciLoop`, description: innovation.summary, alternates: { canonical: "/sciloop/live/crispr-gene-editing" } }
  : { title: "Signal not found | SciLoop" };

export default function CrisprGeneEditingPage() {
  if (!innovation) notFound();
  return <InnovationExplorer innovation={innovation} />;
}
