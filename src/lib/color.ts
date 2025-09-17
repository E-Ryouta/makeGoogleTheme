import type { RGB } from "../types/theme";

export function rgbToHex(rgb?: RGB): string {
  if (!rgb) return "";
  const [r, g, b] = rgb;
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function hexToRgb(hex: string): RGB | undefined {
  const m = hex.trim().replace(/^#/, "");
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    return [r, g, b];
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return [r, g, b];
  }
  return undefined;
}

function srgbToLinear(v: number): number {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: RGB): number {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a?: RGB, b?: RGB): number | undefined {
  if (!a || !b) return undefined;
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Convenience: convert either RGB or [r,g,b,a] to CSS color string
export function colorToCss(c?: any): string {
  if (!c) return "";
  if (Array.isArray(c) && c.length === 4) {
    const [r, g, b, a] = c as [number, number, number, number];
    const rr = Math.max(0, Math.min(255, r));
    const gg = Math.max(0, Math.min(255, g));
    const bb = Math.max(0, Math.min(255, b));
    const aa = Math.max(0, Math.min(1, a));
    return `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
  }
  return rgbToHex(c as RGB);
}
