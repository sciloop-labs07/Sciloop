import type { Metadata } from "next";

import { SciLoopWorkbench } from "@/components/workbench/sciloop-workbench";

export const metadata: Metadata = {
  title: "SciLoop Workbench | SciLoop",
  description: "The unified intent-driven workbench for SciLoop scientific capabilities.",
};

export default function WorkbenchPage() {
  return (
    <div className="page-shell pb-12 pt-4">
      <SciLoopWorkbench />
    </div>
  );
}
