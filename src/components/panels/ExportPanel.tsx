import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom } from '../../store/themeAtoms';
import { buildManifest } from '../../lib/manifest';
import { buildZip } from '../../lib/zip';
import { saveThemeProject, loadThemeProject } from '../../lib/project';

export const ExportPanel: React.FC = () => {
  const [state, setState] = useAtom(themeStateAtom);
  const manifest = buildManifest(state);

  const onDownload = async () => {
    const blob = await buildZip(state);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSave = async () => {
    const proj = await saveThemeProject(state);
    const url = URL.createObjectURL(proj);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.themeproj.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const blob = new Blob([buf], { type: 'application/json' });
    const loaded = await loadThemeProject(blob);
    setState(loaded);
  };

  return (
    <div>
      <h2>Export</h2>
      <pre style={{ maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(manifest, null, 2)}</pre>
      <button onClick={onDownload}>Download ZIP</button>
      <button onClick={onSave}>Save .themeproj</button>
      <input type="file" onChange={onLoad} />
    </div>
  );
};
