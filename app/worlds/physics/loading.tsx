export default function PhysicsWorldLoading() {
  return (
    <div className="page-shell pb-12 pt-4">
      <div className="space-y-6">
        <div className="panel-surface rounded-[32px] p-8">
          <div className="h-4 w-40 rounded-full bg-white/10" />
          <div className="mt-4 h-12 max-w-3xl rounded-2xl bg-white/8" />
          <div className="mt-4 h-6 max-w-xl rounded-full bg-white/6" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
          <div className="panel-surface h-[38rem] rounded-[30px] bg-white/[0.02]" />
          <div className="space-y-6">
            <div className="panel-surface h-72 rounded-[30px]" />
            <div className="panel-surface h-72 rounded-[30px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
