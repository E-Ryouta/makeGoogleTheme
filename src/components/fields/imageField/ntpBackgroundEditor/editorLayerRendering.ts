import type { EditorLayer } from "./editorLayerModel";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "./editorLayerModel";

export function clampCrop(next: number, opposite: number) {
  const MAX = 0.9;
  if (next + opposite > MAX) {
    return Math.max(0, MAX - opposite);
  }
  return Math.max(0, Math.min(next, 0.45));
}

export async function createLayerFromBlob(
  blob: Blob,
  name: string,
  canvasWidth: number,
  canvasHeight: number,
): Promise<EditorLayer> {
  const dataUrl = await blobToDataUrl(blob);
  const image = await loadImage(dataUrl);
  const baseScale = Math.min(
    1,
    canvasWidth > 0 ? canvasWidth / image.width : 1,
    canvasHeight > 0 ? canvasHeight / image.height : 1,
  );
  const scaledWidth = image.width * baseScale;
  const scaledHeight = image.height * baseScale;
  const safeWidth = canvasWidth || DEFAULT_WIDTH;
  const safeHeight = canvasHeight || DEFAULT_HEIGHT;
  const centerX = (safeWidth - scaledWidth) / 2;
  const centerY = (safeHeight - scaledHeight) / 2;

  return {
    id: crypto.randomUUID(),
    name,
    src: dataUrl,
    naturalWidth: image.width,
    naturalHeight: image.height,
    x: centerX,
    y: centerY,
    scale: baseScale,
    opacity: 1,
    flipHorizontal: false,
    flipVertical: false,
    rotation: 0,
    crop: { left: 0, right: 0, top: 0, bottom: 0 },
  };
}

export function ensureCachedImage(
  cache: Map<string, HTMLImageElement>,
  src: string,
): Promise<HTMLImageElement> {
  const cached = cache.get(src);
  if (cached && cached.complete) {
    return Promise.resolve(cached);
  }
  return loadImage(src).then((image) => {
    cache.set(src, image);
    return image;
  });
}

export function drawLayerOntoContext(
  ctx: CanvasRenderingContext2D,
  layer: EditorLayer,
  image: HTMLImageElement,
) {
  const cropLeft = layer.naturalWidth * layer.crop.left;
  const cropRight = layer.naturalWidth * layer.crop.right;
  const cropTop = layer.naturalHeight * layer.crop.top;
  const cropBottom = layer.naturalHeight * layer.crop.bottom;
  const sourceWidth = Math.max(1, layer.naturalWidth - cropLeft - cropRight);
  const sourceHeight = Math.max(1, layer.naturalHeight - cropTop - cropBottom);
  const drawWidth = sourceWidth * layer.scale;
  const drawHeight = sourceHeight * layer.scale;
  const centerX = layer.x + drawWidth / 2;
  const centerY = layer.y + drawHeight / 2;

  ctx.save();
  ctx.globalAlpha = layer.opacity;
  ctx.translate(centerX, centerY);
  if (layer.rotation !== 0) {
    ctx.rotate(layer.rotation);
  }
  ctx.scale(layer.flipHorizontal ? -1 : 1, layer.flipVertical ? -1 : 1);
  ctx.drawImage(
    image,
    cropLeft,
    cropTop,
    sourceWidth,
    sourceHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (event) => reject(event);
    img.src = src;
  });
}
