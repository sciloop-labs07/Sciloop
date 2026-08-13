import type { Metadata } from "next";
import { ContentStudio } from "@/components/content-studio/content-studio";

export const metadata: Metadata = {
  title: "Content Studio · SciLoop",
  description: "Turn a scientific discovery into an approval-ready short-form video concept.",
};

export default function ContentStudioPage() {
  return <ContentStudio />;
}
