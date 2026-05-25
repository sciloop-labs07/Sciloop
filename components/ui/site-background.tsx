export function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-x-[-10%] top-[-20%] h-[34rem] rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute right-[-12%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-amber-200/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(143,233,255,0.08),transparent_38%)]" />
    </div>
  );
}
