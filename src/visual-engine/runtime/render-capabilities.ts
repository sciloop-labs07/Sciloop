export interface RenderCapabilities {
  webgl2: boolean;
  webgpu: boolean;
  reducedMotion: boolean;
}

/** Feature detection only. It never selects WebGPU as a public default. */
export function getRenderCapabilities(): RenderCapabilities {
  if (typeof window === "undefined") {
    return { webgl2: false, webgpu: false, reducedMotion: false };
  }

  const canvas = document.createElement("canvas");
  const webgl2 = Boolean(canvas.getContext("webgl2"));
  const webgpu = "gpu" in navigator;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { webgl2, webgpu, reducedMotion };
}

export function selectInteractiveRenderer(capabilities: RenderCapabilities): "three-webgl" | "webgpu-experimental" | "canvas-2d" {
  if (capabilities.webgpu && process.env.NEXT_PUBLIC_ENABLE_WEBGPU === "true") return "webgpu-experimental";
  if (capabilities.webgl2) return "three-webgl";
  return "canvas-2d";
}

