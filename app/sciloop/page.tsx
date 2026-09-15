import type { Metadata } from "next";

import { SciLoopIntroduction } from "@/components/sciloop-home/sciloop-introduction";

export const metadata: Metadata = {
  title: "SciLoop · Live Science, Made Clear",
  description: "Discover a live scientific signal, understand its mechanism, and explore what it makes possible.",
  alternates: { canonical: "/" },
};

export default function SciLoopPage() {
  return <SciLoopIntroduction />;
}
