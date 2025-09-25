import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { triggerDownload } from "../../lib/file";
import { buildManifest } from "../../lib/manifest";
import { createZip } from "../../lib/zip";
import { useTheme } from "../../store/themeStore";
import type { ThemeState } from "../../types/theme";

type ConvertToPngOptions = {
  targetSize?: {
    width: number;
    height: number;
  };
};

async function convertToPngBytes(
  blob: Blob,
  options: ConvertToPngOptions = {},
): Promise<Uint8Array> {
  // Draw onto a canvas and export as PNG
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = (e) => reject(e);
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;

    if (!naturalWidth || !naturalHeight)
      throw new Error("Image dimensions unavailable");

    let targetWidth = naturalWidth;
    let targetHeight = naturalHeight;
    let drawWidth = naturalWidth;
    let drawHeight = naturalHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (options.targetSize) {
      targetWidth = options.targetSize.width;
      targetHeight = options.targetSize.height;
      const scale = Math.max(
        targetWidth / naturalWidth,
        targetHeight / naturalHeight,
      );
      drawWidth = naturalWidth * scale;
      drawHeight = naturalHeight * scale;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    const pngBlob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/png",
      ),
    );
    const buf = await pngBlob.arrayBuffer();
    return new Uint8Array(buf);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ExportButton() {
  const { state } = useTheme();
  const manifest = buildManifest(state);
  const { t } = useTranslation();

  async function handleDownloadZip() {
    const files: { name: string; data: Uint8Array }[] = [];
    const manifestData = new TextEncoder().encode(
      JSON.stringify(manifest, null, 2),
    );
    files.push({ name: "manifest.json", data: manifestData });

    // Collect all present images, convert to PNG, and store them under deterministic names
    const images = state.images;
    const present: [
      keyof ThemeState["images"],
      NonNullable<ThemeState["images"][keyof ThemeState["images"]]>,
    ][] = (
      Object.entries(images) as [
        keyof ThemeState["images"],
        ThemeState["images"][keyof ThemeState["images"]],
      ][]
    )
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => [k, v!]);

    const shouldScaleNtpBackground =
      state.properties.ntp_background_scale_to_cover ?? false;

    for (const [key, fileRef] of present) {
      const data = await convertToPngBytes(
        fileRef.blob,
        key === "theme_ntp_background" && shouldScaleNtpBackground
          ? { targetSize: { width: 1920, height: 1080 } }
          : undefined,
      );
      files.push({ name: `images/${String(key)}.png`, data });
    }
    const blob = await createZip(files);
    triggerDownload(`${state.name || "theme"}.zip`, blob);
  }
  return <Button onClick={handleDownloadZip}>{t("export.download")}</Button>;
}
