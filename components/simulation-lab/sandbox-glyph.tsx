"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SandboxGlyphProps {
  kind: string;
  className?: string;
}

function GlyphFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-10 w-10", className)}
    >
      {children}
    </svg>
  );
}

export function SandboxGlyph({ kind, className }: SandboxGlyphProps) {
  switch (kind) {
    case "gravityStrength":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="5.5" />
          <path d="M24 8v8" />
          <path d="M18 16l6-8 6 8" />
          <path d="M10 33c3.2-6.4 8.3-9.6 14-9.6s10.8 3.2 14 9.6" />
          <path d="M15 38h18" />
        </GlyphFrame>
      );
    case "energyAbundance":
      return (
        <GlyphFrame className={className}>
          <path d="M24 6l6.5 10.5L42 24l-11.5 7.5L24 42l-6.5-10.5L6 24l11.5-7.5L24 6z" />
          <path d="M24 13l-3.5 10h5l-2 12 8-14h-5l2.5-8z" />
        </GlyphFrame>
      );
    case "biologicalResilience":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="15" />
          <path d="M18 31c6.8-1.1 12-6.3 13-13-6.8 1.1-12 6.3-13 13z" />
          <path d="M18 31c4.6-5.4 8.8-8.9 13-13" />
          <path d="M15 18c2.2 1 3.9 2.7 4.9 4.9" />
        </GlyphFrame>
      );
    case "travelEfficiency":
      return (
        <GlyphFrame className={className}>
          <circle cx="11" cy="24" r="3" />
          <circle cx="24" cy="14" r="3" />
          <circle cx="37" cy="24" r="3" />
          <circle cx="24" cy="34" r="3" />
          <path d="M14 23l7-7" />
          <path d="M27 15l7 7" />
          <path d="M34 25l-7 7" />
          <path d="M21 33l-7-7" />
          <path d="M17 24h14" />
        </GlyphFrame>
      );
    case "intelligenceAcceleration":
      return (
        <GlyphFrame className={className}>
          <circle cx="14" cy="18" r="2.5" />
          <circle cx="24" cy="11" r="2.5" />
          <circle cx="34" cy="18" r="2.5" />
          <circle cx="17" cy="31" r="2.5" />
          <circle cx="31" cy="31" r="2.5" />
          <path d="M16 19.5l6-6" />
          <path d="M26 13.5l6 4.5" />
          <path d="M15.7 20.2L17 28.5" />
          <path d="M32.2 20.2L31 28.5" />
          <path d="M19.5 31h9" />
          <path d="M17 37h14" />
        </GlyphFrame>
      );
    case "environmentStability":
      return (
        <GlyphFrame className={className}>
          <path d="M24 6l14 5.5v10.2C38 30.8 32.3 37.4 24 42 15.7 37.4 10 30.8 10 21.7V11.5L24 6z" />
          <path d="M17 24l5 5 9-10" />
        </GlyphFrame>
      );
    case "earth":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="16" />
          <path d="M8 24h32" />
          <path d="M24 8c-4.4 4.4-6.6 9.7-6.6 16s2.2 11.6 6.6 16" />
          <path d="M24 8c4.4 4.4 6.6 9.7 6.6 16s-2.2 11.6-6.6 16" />
          <path d="M12 16c3.4 2.2 7.4 3.3 12 3.3s8.6-1.1 12-3.3" />
          <path d="M12 32c3.4-2.2 7.4-3.3 12-3.3s8.6 1.1 12 3.3" />
        </GlyphFrame>
      );
    case "stable":
      return (
        <GlyphFrame className={className}>
          <path d="M24 8l13.9 8v16L24 40 10.1 32V16L24 8z" />
          <circle cx="24" cy="24" r="5" />
        </GlyphFrame>
      );
    case "unstable":
      return (
        <GlyphFrame className={className}>
          <path d="M24 7l17 30H7L24 7z" />
          <path d="M24 17v8" />
          <circle cx="24" cy="31" r="1.5" fill="currentColor" stroke="none" />
        </GlyphFrame>
      );
    case "chaotic":
      return (
        <GlyphFrame className={className}>
          <path d="M11 24c0-7.2 5.8-13 13-13 3.7 0 7.1 1.5 9.4 4" />
          <path d="M37 24c0 7.2-5.8 13-13 13-3.7 0-7.1-1.5-9.4-4" />
          <path d="M31 10l2.4 5.2-5.7 1" />
          <path d="M17 38l-2.4-5.2 5.7-1" />
          <path d="M15 16l18 16" />
        </GlyphFrame>
      );
    case "lifeless":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="15" />
          <path d="M16 16l16 16" />
          <path d="M32 16L16 32" />
          <path d="M18 24h12" />
        </GlyphFrame>
      );
    case "hyper-productive":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="7" />
          <path d="M24 6v8" />
          <path d="M24 34v8" />
          <path d="M6 24h8" />
          <path d="M34 24h8" />
          <path d="M11 11l5.5 5.5" />
          <path d="M31.5 31.5L37 37" />
          <path d="M11 37l5.5-5.5" />
          <path d="M31.5 16.5L37 11" />
        </GlyphFrame>
      );
    case "broken":
      return (
        <GlyphFrame className={className}>
          <path d="M24 8l13.9 8v16L24 40 10.1 32V16L24 8z" />
          <path d="M22 10l-2 9 4 4-5 7 5 8" />
          <path d="M27 14l4 4-3 6 4 4" />
        </GlyphFrame>
      );
    case "browser":
      return (
        <GlyphFrame className={className}>
          <rect x="8" y="11" width="32" height="24" rx="4" />
          <path d="M8 18h32" />
          <circle cx="14" cy="14.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="18" cy="14.5" r="1" fill="currentColor" stroke="none" />
          <path d="M18 29l4-6 4 4 4-6" />
        </GlyphFrame>
      );
    case "auto":
      return (
        <GlyphFrame className={className}>
          <circle cx="18" cy="24" r="8" />
          <circle cx="30" cy="24" r="8" />
          <path d="M18 10v4" />
          <path d="M30 34v4" />
        </GlyphFrame>
      );
    case "interactive":
      return (
        <GlyphFrame className={className}>
          <path d="M24 8v10" />
          <path d="M24 30v10" />
          <path d="M8 24h10" />
          <path d="M30 24h10" />
          <circle cx="24" cy="24" r="5" />
        </GlyphFrame>
      );
    case "demo":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="4" />
          <ellipse cx="24" cy="24" rx="14" ry="8" />
          <path d="M24 10c6 4 9 8.6 9 14s-3 10-9 14" />
        </GlyphFrame>
      );
    case "observe":
      return (
        <GlyphFrame className={className}>
          <path d="M6 24s6.5-10 18-10 18 10 18 10-6.5 10-18 10S6 24 6 24z" />
          <circle cx="24" cy="24" r="4.5" />
        </GlyphFrame>
      );
    case "mechanism":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="4.5" />
          <circle cx="14" cy="18" r="2.5" />
          <circle cx="34" cy="18" r="2.5" />
          <circle cx="24" cy="34" r="2.5" />
          <path d="M16 19.2l5.2 3.1" />
          <path d="M32 19.2l-5.2 3.1" />
          <path d="M24 29v2.5" />
        </GlyphFrame>
      );
    case "cinematic":
      return (
        <GlyphFrame className={className}>
          <rect x="8" y="11" width="32" height="26" rx="4" />
          <path d="M14 11v26" />
          <path d="M34 11v26" />
          <path d="M18 17h8" />
          <path d="M18 24h12" />
          <path d="M18 31h6" />
        </GlyphFrame>
      );
    case "before":
      return (
        <GlyphFrame className={className}>
          <path d="M31 12L17 24l14 12" />
          <path d="M18 24h18" />
        </GlyphFrame>
      );
    case "after":
      return (
        <GlyphFrame className={className}>
          <path d="M17 12l14 12-14 12" />
          <path d="M12 24h18" />
        </GlyphFrame>
      );
    case "shift":
      return (
        <GlyphFrame className={className}>
          <path d="M10 24h28" />
          <path d="M28 14l10 10-10 10" />
          <path d="M10 16h10" />
          <path d="M10 32h10" />
        </GlyphFrame>
      );
    case "confidence":
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="14" />
          <circle cx="24" cy="24" r="8" />
          <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
        </GlyphFrame>
      );
    case "field":
      return (
        <GlyphFrame className={className}>
          <ellipse cx="24" cy="24" rx="15" ry="6" />
          <ellipse cx="24" cy="24" rx="6" ry="15" />
          <circle cx="24" cy="24" r="3.5" />
        </GlyphFrame>
      );
    case "warning":
      return (
        <GlyphFrame className={className}>
          <path d="M24 7l17 30H7L24 7z" />
          <path d="M24 16v10" />
          <circle cx="24" cy="32" r="1.6" fill="currentColor" stroke="none" />
        </GlyphFrame>
      );
    default:
      return (
        <GlyphFrame className={className}>
          <circle cx="24" cy="24" r="14" />
          <path d="M24 14v20" />
          <path d="M14 24h20" />
        </GlyphFrame>
      );
  }
}
