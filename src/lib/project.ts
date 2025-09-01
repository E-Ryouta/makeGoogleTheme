import { ThemeState, FileRef } from '../types';

interface StoredFileRef {
  name: string;
  type: string;
  data: string; // base64
  width?: number;
  height?: number;
}

// Serialize ThemeState (including image data) to a Blob representing .themeproj.json
export async function saveThemeProject(state: ThemeState): Promise<Blob> {
  const copy: any = { ...state, images: {} };
  for (const key of Object.keys(state.images) as (keyof ThemeState['images'])[]) {
    const f = state.images[key];
    if (!f) continue;
    const buf = Buffer.from(await f.blob.arrayBuffer()).toString('base64');
    const stored: StoredFileRef = {
      name: f.name,
      type: f.blob.type || 'application/octet-stream',
      data: buf,
      width: f.width,
      height: f.height,
    };
    copy.images[key] = stored;
  }
  return new Blob([JSON.stringify(copy)], { type: 'application/json' });
}

// Load ThemeState from a .themeproj.json Blob
export async function loadThemeProject(blob: Blob): Promise<ThemeState> {
  const text = await blob.text();
  const obj = JSON.parse(text);
  const images: Record<string, FileRef> = {};
  if (obj.images) {
    for (const [key, value] of Object.entries(obj.images) as [string, StoredFileRef][]) {
      const buf = Buffer.from(value.data, 'base64');
      images[key] = {
        id: key,
        name: value.name,
        blob: new Blob([buf], { type: value.type }),
        width: value.width,
        height: value.height,
      };
    }
  }
  return { ...obj, images } as ThemeState;
}
