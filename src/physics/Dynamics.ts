import { clamp } from "@/src/utils/math";

export function damp(value: number, amount: number) {
  return value * clamp(1 - amount, 0, 1);
}
