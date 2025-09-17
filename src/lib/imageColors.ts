import type { RGB } from "../types/theme";

const MAX_DIMENSION = 256;
const BORDER_RATIO = 0.08;
const MIN_ALPHA = 40; // ignore mostly transparent pixels

function quantize(value: number): number {
  const q = Math.round(value / 16) * 16;
  if (q < 0) return 0;
  if (q > 255) return 255;
  return q;
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

export async function getDominantEdgeColor(blob: Blob): Promise<RGB | null> {
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

    const colorMap = new Map<
      string,
      { r: number; g: number; b: number; count: number }
    >();

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

    let best: { r: number; g: number; b: number; count: number } | undefined;
    for (const entry of colorMap.values()) {
      if (!best || entry.count > best.count) {
        best = entry;
      }
    }

    if (!best) return null;
    const { r, g, b, count } = best;
    return [
      Math.round(r / count),
      Math.round(g / count),
      Math.round(b / count),
    ];
  } finally {
    cleanup();
  }
}
