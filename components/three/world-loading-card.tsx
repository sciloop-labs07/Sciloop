interface WorldLoadingCardProps {
  title?: string;
  detail?: string;
}

export function WorldLoadingCard({
  title = "Loading Physics World",
  detail = "Preparing the energy core, field lines, particles, and atmosphere.",
}: WorldLoadingCardProps) {
  return (
    <div className="panel-surface world-frame relative flex h-[30rem] items-center justify-center overflow-hidden rounded-[30px] border border-white/10 p-6 text-center md:h-[42rem]">
      <div className="world-grid absolute inset-0" />
      <div className="relative z-10 max-w-lg space-y-4">
        <div className="eyebrow justify-center">Scene loading</div>
        <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">
          {title}
        </h3>
        <p className="text-sm leading-7 text-slate-300 md:text-base">
          {detail}
        </p>
        <div className="mx-auto mt-6 h-2 w-56 overflow-hidden rounded-full bg-white/8">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-300/70" />
        </div>
      </div>
    </div>
  );
}
