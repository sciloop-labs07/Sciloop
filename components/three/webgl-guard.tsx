"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";

interface WebGLGuardProps extends PropsWithChildren {
  fallback: ReactNode;
}

function detectWebGL() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function WebGLGuard({ children, fallback }: WebGLGuardProps) {
  const [canRender] = useState<boolean>(() => detectWebGL());

  if (!canRender) {
    return fallback;
  }

  return children;
}
