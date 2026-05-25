export const semanticColors = {
  energy: "#ffd166",
  signal: "#7df4ff",
  force: "#9a7dff",
  growth: "#7cffb2",
  decay: "#ff6b8b",
  feedback: "#f3a7ff",
  money: "#9cff7d",
  constraint: "#ff8f70",
  information: "#8fe9ff",
  neutral: "#dce9ff",
};

export function withAlpha(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
