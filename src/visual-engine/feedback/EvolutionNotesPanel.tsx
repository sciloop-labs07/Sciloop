import {
  createEvolutionNotesFromFeedback,
  suggestEngineImprovements,
  suggestPatternImprovements,
  suggestRecipeImprovements,
} from "./feedbackEvolution";
import type { VisualEvolutionNote, VisualFeedback } from "./feedback.types";

interface EvolutionNotesPanelProps {
  feedbackList: VisualFeedback[];
  patternId?: string;
  recipeId?: string;
  engineId?: string;
}

function NoteGroup({ title, notes }: { title: string; notes: VisualEvolutionNote[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      {notes.length > 0 ? (
        <div className="mt-3 space-y-3">
          {notes.map((note) => (
            <article key={note.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-cyan-100">{note.title}</p>
                <span className="text-xs text-slate-400">{note.evidenceCount} signal(s)</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{note.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{note.suggestedAction}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-400">Not enough local evidence for a learning note yet.</p>
      )}
    </div>
  );
}

export function EvolutionNotesPanel({ feedbackList, patternId, recipeId, engineId }: EvolutionNotesPanelProps) {
  const patternNotes = patternId ? suggestPatternImprovements(patternId, feedbackList).notes : [];
  const recipeNotes = recipeId ? suggestRecipeImprovements(recipeId, feedbackList).notes : [];
  const engineNotes = engineId ? suggestEngineImprovements(engineId, feedbackList) : [];
  const languageNotes = createEvolutionNotesFromFeedback(feedbackList);

  return (
    <section className="rounded-xl border border-violet-300/20 bg-violet-300/[0.04] p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200/80">SciLoop learning notes</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Suggested evolution, never automatic rewriting</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        These rule-based notes preserve human review and the controlled visual language.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <NoteGroup title="Pattern improvements" notes={patternNotes} />
        <NoteGroup title="Recipe improvements" notes={recipeNotes} />
        <NoteGroup title="Engine improvements" notes={engineNotes} />
        <NoteGroup title="Visual language improvements" notes={languageNotes} />
      </div>
    </section>
  );
}
