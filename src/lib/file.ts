export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

export async function dataURLToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

export function triggerDownload(filename: string, data: Blob | string) {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: "application/octet-stream" })
      : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function safeDownloadName(name: string): string {
  const sanitized = Array.from(name.trim())
    .map((character) =>
      character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character)
        ? "-"
        : character,
    )
    .join("")
    .replace(/[. ]+$/g, "")
    .slice(0, 80);
  return sanitized || "theme";
}
