export const PREDICTIVE_VISUAL_CANARY_SLUG = "google-quantum-chip";

/**
 * Public by design: this only controls a client-side UI canary. It never
 * grants access to providers, private data, or server-side engine controls.
 */
export const predictiveVisualCanaryEnabled =
  process.env.NEXT_PUBLIC_SCILOOP_PREDICTIVE_VISUALS === "true";
