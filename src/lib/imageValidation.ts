export const IMAGE_LIMITS = {
  // 巨大画像によるブラウザのメモリ枯渇を防ぐため、入力とCanvasの上限を一元管理する。
  maxFileBytes: 10 * 1024 * 1024,
  maxDimension: 8192,
  maxPixels: 40_000_000,
  maxEditorLayers: 20,
} as const;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export type ValidatedImage = {
  width: number;
  height: number;
  type: SupportedImageType;
};

export class ImageValidationError extends Error {
  readonly code:
    | "unsupported-type"
    | "file-too-large"
    | "decode-failed"
    | "dimensions-too-large"
    | "too-many-pixels"
    | "too-many-layers";

  constructor(code: ImageValidationError["code"]) {
    super(code);
    this.code = code;
    this.name = "ImageValidationError";
  }
}

function isSupportedImageType(type: string): type is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(type as SupportedImageType);
}

async function hasExpectedSignature(
  blob: Blob,
  type: SupportedImageType,
): Promise<boolean> {
  // MIMEタイプは偽装できるため、主要なマジックナンバーも照合してからデコードする。
  const bytes = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (type === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }
  if (type === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8;
  }
  return (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function assertSafeDimensions(width: number, height: number) {
  // 辺の長さだけでなく総画素数も制限し、細長い画像や高DPI Canvasも安全側に倒す。
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new ImageValidationError("decode-failed");
  }
  if (width > IMAGE_LIMITS.maxDimension || height > IMAGE_LIMITS.maxDimension) {
    throw new ImageValidationError("dimensions-too-large");
  }
  if (width * height > IMAGE_LIMITS.maxPixels) {
    throw new ImageValidationError("too-many-pixels");
  }
}

export function assertSafeCanvasSize(width: number, height: number) {
  assertSafeDimensions(Math.round(width), Math.round(height));
}

async function decodeDimensions(
  blob: Blob,
): Promise<{ width: number; height: number }> {
  // 実際にデコードできる画像だけを受け入れ、壊れたファイルをテーマ状態へ入れない。
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dimensions;
    } catch {
      throw new ImageValidationError("decode-failed");
    }
  }

  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageValidationError("decode-failed"));
    };
    image.src = url;
  });
}

export async function validateImageFile(file: File): Promise<ValidatedImage> {
  // 安価な検証から順に実行し、不正・巨大な入力を画像デコーダへ渡す前に拒否する。
  if (!isSupportedImageType(file.type)) {
    throw new ImageValidationError("unsupported-type");
  }
  if (file.size > IMAGE_LIMITS.maxFileBytes) {
    throw new ImageValidationError("file-too-large");
  }
  if (!(await hasExpectedSignature(file, file.type))) {
    throw new ImageValidationError("unsupported-type");
  }

  const { width, height } = await decodeDimensions(file);
  assertSafeDimensions(width, height);
  return { width, height, type: file.type };
}

export function assertEditorLayerCapacity(
  currentCount: number,
  addedCount: number,
) {
  // 一括選択時も合計数で判定し、レイヤー追加によるメモリ使用量の急増を防ぐ。
  if (currentCount + addedCount > IMAGE_LIMITS.maxEditorLayers) {
    throw new ImageValidationError("too-many-layers");
  }
}
