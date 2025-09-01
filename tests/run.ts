import assert from 'assert';
import { buildManifest } from '../src/lib/manifest';
import { buildZip } from '../src/lib/zip';
import { ThemeState } from '../src/types';
import JSZip from 'jszip';
import { validateTheme } from '../src/lib/validate';
import { saveThemeProject, loadThemeProject } from '../src/lib/project';

async function main() {
  const blob = new Blob(['dummy'], { type: 'text/plain' });
  const state: ThemeState = {
    name: 'My Theme',
    version: '1.0',
    images: {
      theme_frame: { id: '1', name: 'frame.txt', blob },
      theme_ntp_background: { id: '2', name: 'bg.txt', blob, width: 1000 },
    },
    colors: {
      frame: [1,2,3],
      toolbar: [4,5,6],
      tab_background_text: [7,8,9],
      bookmark_text: [10,11,12],
      ntp_text: [13,14,15],
      ntp_link: [16,17,18]
    },
    tints: {
      buttons: [0.1, 0.2, 0.3]
    },
    properties: {
      ntp_background_alignment: 'center',
      ntp_background_repeat: 'no-repeat',
      ntp_background_size: 'cover'
    },
    _preview: { fit: 'cover', position: 'center center' }
  };

  const manifest = buildManifest(state);
  assert.strictEqual(manifest.theme.images.theme_frame, 'images/frame.txt');
  assert.strictEqual(manifest.theme.colors.frame[0], 1);

  const buf = await buildZip(state);
  const zip = await JSZip.loadAsync(buf);
  assert.ok(zip.file('manifest.json'));
  assert.ok(zip.file('images/frame.txt'));

  const bad: ThemeState = {
    name: '',
    version: '',
    images: {},
    colors: {
      frame: [0,0,0],
      tab_background_text: [0,0,0],
      toolbar: [0,0,0],
      bookmark_text: [0,0,0],
    },
    tints: {},
    properties: {},
  } as any;
  const issues = validateTheme(bad);
  assert.ok(issues.find(i => i.key === 'name'));
  assert.ok(issues.find(i => i.key === 'frame-tab_background_text'));

  const proj = await saveThemeProject(state);
  const restored = await loadThemeProject(proj);
  assert.deepStrictEqual(restored.colors.frame, state.colors.frame);
  assert.strictEqual(restored.images.theme_frame?.name, 'frame.txt');
  const txt = await restored.images.theme_frame!.blob.text();
  assert.strictEqual(txt, 'dummy');
  console.log('tests passed');
}

main();
