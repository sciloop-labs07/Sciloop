import { MeaningEnginePortal } from "@/components/meaning-engine/meaning-engine-portal";
import {
  getMeaningConcept,
  meaningEngineSubjects,
} from "@/data/meaning-engine";
import type { MeaningEngineSubjectId } from "@/lib/types";

interface MeaningEnginePageProps {
  searchParams: Promise<{ concept?: string; subject?: string }>;
}

export default async function MeaningEnginePage({
  searchParams,
}: MeaningEnginePageProps) {
  const params = await searchParams;
  const subjectParam = params.subject;
  const initialSubjectId = meaningEngineSubjects.some(
    (subject) => subject.id === subjectParam,
  )
    ? (subjectParam as MeaningEngineSubjectId)
    : meaningEngineSubjects[0].id;
  const initialConcept = getMeaningConcept(initialSubjectId, params.concept);

  return (
    <div className="page-shell space-y-6 pb-12 pt-4">
      <MeaningEnginePortal
        key={`${initialSubjectId}:${initialConcept.id}`}
        initialConceptId={initialConcept.id}
        initialSubjectId={initialSubjectId}
      />
    </div>
  );
}
