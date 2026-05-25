"use client";

interface TimelineControlsProps {
  playing: boolean;
  timeline: number;
  onPlayPause: () => void;
  onReset: () => void;
  onScrub: (value: number) => void;
}

export function TimelineControls({ playing, timeline, onPlayPause, onReset, onScrub }: TimelineControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 md:flex-row md:items-center">
      <div className="flex gap-2">
        <button className="rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-white" type="button" onClick={onPlayPause}>
          {playing ? "Pause" : "Play"}
        </button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
      <label className="flex flex-1 items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
        Timeline
        <input
          className="w-full accent-cyan-200"
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={timeline}
          onChange={(event) => onScrub(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
