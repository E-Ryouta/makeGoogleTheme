import type { RGB } from "../types/theme";

const MAX_DIMENSION = 256;
const BORDER_RATIO = 0.08;
const MIN_ALPHA = 40; // ignore mostly transparent pixels
const MIN_SECONDARY_DISTANCE = 36;

type EdgeColorEntry = { r: number; g: number; b: number; count: number };

export type EdgeColorSuggestions = {
  background: RGB;
  frame: RGB;
  toolbar: RGB;
};

function quantize(value: number): number {
  const q = Math.round(value / 16) * 16;
  if (q < 0) return 0;
  if (q > 255) return 255;
  return q;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function rgbToHsl([r, g, b]: RGB): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return [h / 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const hue = ((h % 1) + 1) % 1; // keep in [0,1)
  const saturation = clamp(s, 0, 1);
  const lightness = clamp(l, 0, 1);

  if (saturation === 0) {
    const gray = Math.round(lightness * 255);
    return [gray, gray, gray];
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const toChannel = (t: number) => {
    let temp = t;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  };

  const r = Math.round(toChannel(hue + 1 / 3) * 255);
  const g = Math.round(toChannel(hue) * 255);
  const b = Math.round(toChannel(hue - 1 / 3) * 255);
  return [r, g, b];
}

function colorDistance(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function entryAverage(entry: EdgeColorEntry): RGB {
  return [
    Math.round(entry.r / entry.count),
    Math.round(entry.g / entry.count),
    Math.round(entry.b / entry.count),
  ];
}

function clampLightness(rgb: RGB, min: number, max: number): RGB {
  const [h, s, l] = rgbToHsl(rgb);
  const nextL = clamp(l, min, max);
  if (nextL === l) return rgb;
  return hslToRgb(h, s, nextL);
}

function ensureContrast(base: RGB, variant: RGB, minDelta: number): RGB {
  const [, , baseL] = rgbToHsl(base);
  const [h, s, variantL] = rgbToHsl(variant);
  if (Math.abs(variantL - baseL) >= minDelta) {
    return variant;
  }

  const adjust = baseL < 0.5 ? baseL + minDelta : baseL - minDelta;
  return hslToRgb(h, s, clamp(adjust, 0.05, 0.95));
}

async function loadImageBitmap(blob: Blob): Promise<{
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}> {
  if (typeof window === "undefined") throw new Error("window is undefined");

  if (
    "createImageBitmap" in window &&
    typeof createImageBitmap === "function"
  ) {
    const bitmap = await createImageBitmap(blob);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    };
  }

  return await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => URL.revokeObjectURL(url),
      });
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export async function getEdgeColorSuggestions(
  blob: Blob,
): Promise<EdgeColorSuggestions | null> {
  if (!blob) return null;
  if (typeof document === "undefined") return null;

  let image: Awaited<ReturnType<typeof loadImageBitmap>> | undefined;
  try {
    image = await loadImageBitmap(blob);
  } catch (err) {
    console.error("Failed to load image for edge color:", err);
    return null;
  }

  const { source, width, height, cleanup } = image;
  try {
    if (!width || !height) return null;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(source, 0, 0, width, height, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;

    const borderThickness = Math.max(
      1,
      Math.round(Math.min(targetWidth, targetHeight) * BORDER_RATIO),
    );

    const colorMap = new Map<string, EdgeColorEntry>();

    for (let y = 0; y < targetHeight; y += 1) {
      for (let x = 0; x < targetWidth; x += 1) {
        const onHorizontalBorder =
          y < borderThickness || y >= targetHeight - borderThickness;
        const onVerticalBorder =
          x < borderThickness || x >= targetWidth - borderThickness;
        if (!onHorizontalBorder && !onVerticalBorder) continue;

        const idx = (y * targetWidth + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a < MIN_ALPHA) continue;

        const key = `${quantize(r)},${quantize(g)},${quantize(b)}`;
        const entry = colorMap.get(key);
        if (entry) {
          entry.count += 1;
          entry.r += r;
          entry.g += g;
          entry.b += b;
        } else {
          colorMap.set(key, { r, g, b, count: 1 });
        }
      }
    }

    if (colorMap.size === 0) return null;

    const palette = Array.from(colorMap.values())
      .map((entry) => ({ color: entryAverage(entry), count: entry.count }))
      .sort((a, b) => b.count - a.count);

    const primarySwatch = palette[0];
    if (!primarySwatch) return null;

    const background = primarySwatch.color;
    const [baseH, baseS, baseL] = rgbToHsl(background);

    const secondarySwatch = palette
      .slice(1)
      .find((swatch) => colorDistance(background, swatch.color) >= MIN_SECONDARY_DISTANCE);

    let secondary = secondarySwatch?.color;
    if (!secondary) {
      const targetL = clamp(
        baseL + (baseL < 0.5 ? 0.23 : -0.23),
        0.12,
        0.88,
      );
      const targetS = clamp(baseS * 0.85 + 0.05, 0.1, 1);
      secondary = hslToRgb(baseH, targetS, targetL);
    }

    const frame = clampLightness(background, 0.2, 0.78);

    let toolbar = clampLightness(secondary, 0.25, 0.9);
    const [toolbarH, toolbarS, toolbarL] = rgbToHsl(toolbar);
    const softenedS = clamp(toolbarS * 0.9 + 0.05, 0.08, 1);
    toolbar = hslToRgb(toolbarH, softenedS, toolbarL);
    toolbar = ensureContrast(frame, toolbar, 0.18);

    return {
      background,
      frame,
      toolbar,
    };
  } finally {
    cleanup();
  }
}

export async function getDominantEdgeColor(blob: Blob): Promise<RGB | null> {
  const result = await getEdgeColorSuggestions(blob);
  return result?.background ?? null;
}
