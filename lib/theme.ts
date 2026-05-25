export const themeTokens = {
  colors: {
    bg: "#04060d",
    bgSoft: "#09111f",
    panel: "rgba(9, 16, 30, 0.66)",
    panelStrong: "rgba(10, 18, 34, 0.84)",
    panelLight: "rgba(255, 255, 255, 0.04)",
    border: "rgba(143, 190, 255, 0.16)",
    borderStrong: "rgba(143, 190, 255, 0.32)",
    text: "#f3f6ff",
    textSoft: "rgba(221, 230, 255, 0.76)",
    textMuted: "rgba(204, 216, 255, 0.52)",
    cyan: "#8fe9ff",
    blue: "#7db1ff",
    gold: "#f3c88d",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  radius: {
    sm: "1rem",
    md: "1.5rem",
    lg: "1.75rem",
    xl: "2rem",
    pill: "999px",
  },
  glow: {
    soft: "0 18px 44px rgba(0, 0, 0, 0.22)",
    panel: "0 30px 80px rgba(0, 0, 0, 0.34)",
    cyan: "0 0 24px rgba(143, 233, 255, 0.16)",
    trace: "0 0 18px rgba(143, 233, 255, 0.26)",
  },
} as const;

export function createThemeVariablesCss() {
  const { colors, spacing, radius, glow } = themeTokens;

  return `
    :root {
      --sc-bg: ${colors.bg};
      --sc-bg-soft: ${colors.bgSoft};
      --sc-panel: ${colors.panel};
      --sc-panel-strong: ${colors.panelStrong};
      --sc-panel-light: ${colors.panelLight};
      --sc-border: ${colors.border};
      --sc-border-strong: ${colors.borderStrong};
      --sc-text: ${colors.text};
      --sc-text-soft: ${colors.textSoft};
      --sc-text-muted: ${colors.textMuted};
      --sc-cyan: ${colors.cyan};
      --sc-blue: ${colors.blue};
      --sc-gold: ${colors.gold};
      --sc-space-xs: ${spacing.xs};
      --sc-space-sm: ${spacing.sm};
      --sc-space-md: ${spacing.md};
      --sc-space-lg: ${spacing.lg};
      --sc-space-xl: ${spacing.xl};
      --sc-space-2xl: ${spacing["2xl"]};
      --sc-space-3xl: ${spacing["3xl"]};
      --sc-radius-sm: ${radius.sm};
      --sc-radius-md: ${radius.md};
      --sc-radius-lg: ${radius.lg};
      --sc-radius-xl: ${radius.xl};
      --sc-radius-pill: ${radius.pill};
      --sc-shadow-soft: ${glow.soft};
      --sc-shadow-panel: ${glow.panel};
      --sc-glow-cyan: ${glow.cyan};
      --sc-glow-trace: ${glow.trace};
    }
  `;
}
