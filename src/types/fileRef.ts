export type FileRef = {
  id: string; // internal
  name: string; // exported filename
  blob: Blob;
  width?: number;
  height?: number;
};
