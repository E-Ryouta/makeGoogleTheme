import JSZip from 'jszip';
import { ThemeState, FileRef } from '../types';
import { buildManifest } from './manifest';

export async function buildZip(state: ThemeState) {
  const zip = new JSZip();
  const manifest = buildManifest(state);

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  const folder = zip.folder('images');
  const used = [
    state.images.theme_frame,
    state.images.theme_ntp_background,
  ].filter(Boolean) as FileRef[];

  for (const f of used) {
    const buf = await f.blob.arrayBuffer();
    folder!.file(f.name, buf);
  }
  return zip.generateAsync({ type: 'nodebuffer' });
}
