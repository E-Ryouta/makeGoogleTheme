export function blobToObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string) {
  URL.revokeObjectURL(url);
}
