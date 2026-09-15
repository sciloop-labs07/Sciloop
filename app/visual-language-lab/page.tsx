import type { Metadata } from "next";

import { VisualLanguageLab } from "@/src/ui/VisualLanguageLab";

export const metadata: Metadata = {
  title: "Visual Language Lab | SciLoop",
  description:
    "A browser-native semantic simulation lab that turns concepts into causal visual explanations.",
};

export default function VisualLanguageLabPage() {
  return <VisualLanguageLab />;
}
