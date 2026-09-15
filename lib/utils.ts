import { clsx, type ClassValue } from "clsx";

import type { Discovery } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function getDiscoveryBySlug(discoveries: Discovery[], slug?: string) {
  if (!slug) return discoveries[0];
  return discoveries.find((discovery) => discovery.slug === slug) ?? discoveries[0];
}

export function toPercent(value: number) {
  return `${Math.round(clamp(value) * 100)}%`;
}
