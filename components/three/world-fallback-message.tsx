import { ButtonLink } from "@/components/ui/button-link";

interface WorldFallbackMessageProps {
  worldName: string;
  title?: string;
  copy?: string;
  statusLabel?: string;
  detailSections?: Array<{
    label: string;
    value: string;
  }>;
}

export function WorldFallbackMessage({
  worldName,
  title = "This world needs WebGL support.",
  copy = "Your browser or device is not exposing the graphics features required for the interactive 3D scene. You can still continue through the discovery summaries while keeping the app fully usable.",
  statusLabel,
  detailSections,
}: WorldFallbackMessageProps) {
  return (
    <div className="world-fallback panel-surface relative flex h-[30rem] items-center justify-center rounded-[30px] border border-white/10 p-6 text-center md:h-[38rem]">
      <div className="max-w-3xl space-y-5">
        <div className="eyebrow justify-center">{worldName} fallback</div>
        <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">
          {title}
        </h3>
        <p className="text-sm leading-7 text-slate-300 md:text-base">
          {copy}
        </p>
        {statusLabel ? (
          <div className="chip rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em]">
            <span className="chip-dot" />
            {statusLabel}
          </div>
        ) : null}
        {detailSections?.length ? (
          <div className="grid gap-3 pt-2 text-left md:grid-cols-3">
            {detailSections.map((section) => (
              <div
                key={section.label}
                className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {section.label}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {section.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <ButtonLink href="/discoveries">Browse discoveries</ButtonLink>
          <ButtonLink href="/about" variant="secondary">
            About SciLoop
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
