import { Button } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { safeDownloadName, triggerDownload } from "../../lib/file";
import {
  assertSafeCanvasSize,
  validateImageFile,
} from "../../lib/imageValidation";
import { buildManifest, validateThemeState } from "../../lib/manifest";
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

    assertSafeCanvasSize(targetWidth, targetHeight);
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
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  async function handleDownloadZip() {
    const toastId = toast.loading(t("export.preparing"));
    setIsExporting(true);
    try {
      const validationErrors = validateThemeState(state);
      if (validationErrors.length > 0) {
        toast.error(t(`export.errors.${validationErrors[0]}`), { id: toastId });
        return;
      }

      const manifest = buildManifest(state);
      const files: { name: string; data: Uint8Array }[] = [
        {
          name: "manifest.json",
          data: new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
        },
      ];

      const present = Object.entries(state.images).filter(
        (
          entry,
        ): entry is [
          keyof ThemeState["images"],
          NonNullable<ThemeState["images"][keyof ThemeState["images"]]>,
        ] => Boolean(entry[1]),
      );

      // 画像を順番に処理してピークメモリを抑えつつ、進捗を画面へ反映する。
      const shouldScaleNtpBackground =
        state.properties.ntp_background_scale_to_cover ?? false;

      for (const [index, [key, fileRef]] of present.entries()) {
        toast.loading(
          t("export.converting", {
            current: index + 1,
            total: present.length,
          }),
          { id: toastId },
        );
        if (fileRef.blob instanceof File) {
          await validateImageFile(fileRef.blob);
        } else {
          assertSafeCanvasSize(fileRef.width ?? 0, fileRef.height ?? 0);
        }
        const data = await convertToPngBytes(
          fileRef.blob,
          key === "theme_ntp_background" && shouldScaleNtpBackground
            ? { targetSize: { width: 1920, height: 1080 } }
            : undefined,
        );
        files.push({ name: `images/${String(key)}.png`, data });
      }

      // 変換完了後にだけZIPを組み立て、処理中の二重ダウンロードを避ける。
      toast.loading(t("export.creatingZip"), { id: toastId });
      const blob = await createZip(files);
      triggerDownload(`${safeDownloadName(state.name)}.zip`, blob);
      toast.success(t("export.success"), { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : t("export.errors.generic"),
        { id: toastId },
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      onClick={() => void handleDownloadZip()}
      loading={isExporting}
      disabled={isExporting}
    >
      {t("export.download")}
    </Button>
  );
}
