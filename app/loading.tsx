export default function Loading() {
  return (
    <div className="page-shell py-24">
      <div className="panel-surface rounded-[32px] p-8 md:p-10">
        <div className="space-y-5">
          <div className="h-4 w-36 rounded-full bg-white/10" />
          <div className="h-12 w-full max-w-2xl rounded-2xl bg-white/8" />
          <div className="h-5 w-full max-w-xl rounded-full bg-white/6" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[24px] bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
