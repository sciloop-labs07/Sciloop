import type { Metadata } from "next";

import { LiveInnovationPortal } from "@/components/live-innovations/live-innovation-portal";

export const metadata: Metadata = {
  title: "Live Innovations | SciLoop",
  description: "Evaluate live science and innovation signals with evidence, mechanism, impact, uncertainty, and next actions.",
};

export default function LiveInnovationsPage() {
  return <LiveInnovationPortal />;
}
