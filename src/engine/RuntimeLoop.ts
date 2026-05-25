export interface RuntimeLoopOptions {
  onFrame: (dt: number, elapsed: number) => void;
}

export class RuntimeLoop {
  private frameId = 0;
  private lastTime = 0;
  private elapsed = 0;
  private smoothedDt = 1 / 60;
  private running = false;
  private readonly onFrame: RuntimeLoopOptions["onFrame"];
  private readonly visibilityHandler = () => {
    if (document.hidden) this.pause();
  };

  constructor(options: RuntimeLoopOptions) {
    this.onFrame = options.onFrame;
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.visibilityHandler);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.elapsed = 0;
    this.lastTime = performance.now();
    this.smoothedDt = 1 / 60;
  }

  destroy() {
    this.pause();
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
    }
  }

  get isRunning() {
    return this.running;
  }

  private tick = (time: number) => {
    if (!this.running) return;
    const rawDt = Math.min(0.05, Math.max(0, (time - this.lastTime) / 1000));
    this.smoothedDt += (rawDt - this.smoothedDt) * 0.22;
    const dt = this.smoothedDt;
    this.lastTime = time;
    this.elapsed += dt;
    this.onFrame(dt, this.elapsed);
    this.frameId = requestAnimationFrame(this.tick);
  };
}
