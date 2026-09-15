"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clamp, lerp } from "@/lib/utils";

interface UseSimulationTransitionOptions {
  durationMs?: number;
  initialProgress?: number;
  reducedMotion?: boolean;
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export function useSimulationTransition({
  durationMs = 1400,
  initialProgress = 0,
  reducedMotion = false,
}: UseSimulationTransitionOptions) {
  const initialProgressValue = clamp(initialProgress);
  const animationFrameRef = useRef<number | null>(null);
  const progressRef = useRef(initialProgressValue);
  const [progress, setProgress] = useState(() => initialProgressValue);

  const stopTransition = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const setProgressImmediate = useCallback(
    (value: number) => {
      stopTransition();
      const safeValue = clamp(value);
      progressRef.current = safeValue;
      setProgress(safeValue);
    },
    [stopTransition],
  );

  const animateToProgress = useCallback(
    (value: number) => {
      const safeTarget = clamp(value);

      if (reducedMotion) {
        setProgressImmediate(safeTarget);
        return;
      }

      stopTransition();

      const startValue = progressRef.current;
      const startTime = performance.now();
      const transitionDuration = Math.max(
        320,
        Math.abs(safeTarget - startValue) * durationMs,
      );

      const step = (time: number) => {
        const elapsed = time - startTime;
        const completion = clamp(elapsed / transitionDuration);
        const easedCompletion = easeInOutCubic(completion);
        const nextValue = lerp(startValue, safeTarget, easedCompletion);

        progressRef.current = nextValue;
        setProgress(nextValue);

        if (completion < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [durationMs, reducedMotion, setProgressImmediate, stopTransition],
  );

  useEffect(() => {
    return () => {
      stopTransition();
    };
  }, [stopTransition]);

  return {
    progress,
    animateToProgress,
    setProgressImmediate,
    stopTransition,
  };
}
