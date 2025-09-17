import { Button } from "@mantine/core";
import { triggerDownload } from "../../lib/file";
import { buildManifest } from "../../lib/manifest";
import { createZip } from "../../lib/zip";
import { useTheme } from "../../store/themeStore";
import type { ThemeState } from "../../types/theme";

async function convertToPngBytes(blob: Blob): Promise<Uint8Array> {
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
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(img, 0, 0);
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

    for (const [key, fileRef] of present) {
      const data = await convertToPngBytes(fileRef.blob);
      files.push({ name: `images/${String(key)}.png`, data });
    }
    const blob = await createZip(files);
    triggerDownload(`${state.name || "theme"}.zip`, blob);
  }

  return <Button onClick={handleDownloadZip}>Download ZIP</Button>;
}
