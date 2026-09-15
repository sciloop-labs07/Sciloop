import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnovationExplorer } from "@/components/innovations/innovation-explorer";
import { getInnovation } from "@/data/innovations";

const innovation = getInnovation("solid-state-battery");

export const metadata: Metadata = innovation
  ? { title: `${innovation.title} | SciLoop`, description: innovation.summary, alternates: { canonical: "/sciloop/live/solid-state-battery" } }
  : { title: "Signal not found | SciLoop" };

export default function SolidStateBatteryPage() {
  if (!innovation) notFound();
  return <InnovationExplorer innovation={innovation} />;
}
