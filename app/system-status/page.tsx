import Link from "next/link";

import { Panel } from "@/components/ui/panel";

export const dynamic = "force-dynamic";

async function getStatus() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/system-status`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${ok ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-rose-300/30 bg-rose-300/10 text-rose-100"}`}>
      {ok ? "Online" : "Needs attention"}
    </span>
  );
}

export default async function SystemStatusPage() {
  const status = await getStatus();
  const aiOk = Boolean(status?.aiBackend?.ok);
  const forLoopOk = Boolean(status?.forLoopBackend?.ok);

  return (
    <div className="page-shell space-y-6 pb-12">
      <Panel className="rounded-[36px] p-6 md:p-9" glow>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <div className="eyebrow">Launch readiness</div>
            <h1 className="font-display text-4xl font-semibold text-white md:text-6xl">
              SciLoop System Status
            </h1>
            <p className="max-w-3xl text-slate-300">
              Use this page before sharing SciLoop publicly. Green means the one-link launch path can reach the frontend, AI backend, and ForLoop backend.
            </p>
          </div>
          <StatusPill ok={Boolean(status?.ok)} />
        </div>
      </Panel>

      <section className="grid gap-5 md:grid-cols-3">
        <Panel className="rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-white">Frontend</h2>
            <StatusPill ok />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Next.js shell, `/sciloop-live`, and proxy routes.</p>
        </Panel>

        <Panel className="rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-white">SciLoop AI</h2>
            <StatusPill ok={aiOk} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">News explanation, Visualize handoff, provider switching, and local fallback.</p>
        </Panel>

        <Panel className="rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-white">ForLoop</h2>
            <StatusPill ok={forLoopOk} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Admin visibility, visual-language plan logging, and control-panel backend.</p>
        </Panel>
      </section>

      <Panel className="rounded-[30px] p-5">
        <div className="eyebrow">Launch links</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full border border-cyan-200/25 px-4 py-2 text-sm text-white" href="/sciloop-live">Open SciLoop Live</Link>
          <Link className="rounded-full border border-cyan-200/25 px-4 py-2 text-sm text-white" href="/visual-language-lab">Open Visual Language Lab</Link>
          <Link className="rounded-full border border-cyan-200/25 px-4 py-2 text-sm text-white" href="/api/system-status">Raw JSON Status</Link>
        </div>
      </Panel>

      <Panel className="rounded-[30px] p-5">
        <div className="eyebrow">Raw check</div>
        <pre className="quiet-scrollbar mt-4 max-h-[420px] overflow-auto rounded-2xl bg-black/40 p-4 text-xs leading-5 text-slate-300">
          {JSON.stringify(status, null, 2)}
        </pre>
      </Panel>
    </div>
  );
}
