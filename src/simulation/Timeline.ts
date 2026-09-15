export class Timeline {
  value = 0;
  speed = 1;

  update(dt: number) {
    this.value = (this.value + dt * this.speed) % 1;
  }

  scrub(value: number) {
    this.value = Math.min(1, Math.max(0, value));
  }

  reset() {
    this.value = 0;
  }
}
