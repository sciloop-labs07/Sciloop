import { StreamingMessage } from "@/src/ai-streaming/components/StreamingMessage";

const examples = [
  "Explain how a black hole bends light using a causal visual language.",
  "Create a reasoning-mode plan for converting science news into a visual simulation.",
  "Generate TypeScript code for a tiny semantic graph validator.",
];

export default function SciLoopAiStreamPage() {
  return (
    <div className="page-shell space-y-8 pb-12">
      <section className="panel-surface rounded-[38px] border border-white/10 bg-white/[0.035] px-6 py-8 md:px-9 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="eyebrow">Production AI UX</div>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
              SciLoop Streaming AI
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              A reusable streaming response system with OpenAI server-side streaming, thinking phases,
              markdown, progressive code highlighting, cancellation, retry, token buffering, and smooth
              ChatGPT-style incremental rendering.
            </p>
          </div>
          <div className="rounded-3xl border border-cyan-200/15 bg-cyan-200/5 p-4 text-sm leading-6 text-cyan-100">
            Add <code className="rounded bg-black/30 px-1.5 py-0.5">OPENAI_API_KEY</code> to your environment,
            then stream from this page.
          </div>
        </div>
      </section>

      <StreamingMessage initialPrompt={examples[0]} />
    </div>
  );
}

