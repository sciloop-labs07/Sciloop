export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 pb-10 pt-8">
      <div className="page-shell">
        <div className="panel-surface flex flex-col gap-4 rounded-[28px] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-lg font-medium text-white">
              SciLoop
            </div>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
              Discover, understand, and explore every breakthrough shaping the future.
            </p>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.22em] text-slate-500">
            Live innovation platform
            <br />
            TypeScript · Tailwind · R3F
          </div>
        </div>
      </div>
    </footer>
  );
}
