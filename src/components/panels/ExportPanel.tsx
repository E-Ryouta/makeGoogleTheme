import { Button, Code, Group, Stack, Text } from "@mantine/core";
import { buildManifest } from "../../lib/manifest";
import { createZip } from "../../lib/zip";
import { blobToDataURL, dataURLToBlob, triggerDownload } from "../../lib/file";
import { ThemeState } from "../../types/theme";
import { useTheme } from "../../store/themeStore";

export default function ExportPanel() {
  const { state, dispatch } = useTheme();
  const manifest = buildManifest(state);

  async function handleDownloadZip() {
    const files: { name: string; data: Uint8Array }[] = [];
    const manifestData = new TextEncoder().encode(JSON.stringify(manifest, null, 2));
    files.push({ name: "manifest.json", data: manifestData });

    const used = [state.images.theme_frame, state.images.theme_ntp_background].filter(Boolean) as NonNullable<ThemeState["images"][keyof ThemeState["images"]]>[];
    for (const f of used) {
      const buf = new Uint8Array(await f.blob.arrayBuffer());
      files.push({ name: `images/${f.name}`, data: buf });
    }
    const blob = await createZip(files);
    triggerDownload(`${state.name || "theme"}.zip`, blob);
  }

  async function handleSaveProject() {
    const proj: any = { ...state, images: {} };
    for (const k of ["theme_frame", "theme_ntp_background"] as const) {
      const f = state.images[k];
      if (f) {
        const dataUrl = await blobToDataURL(f.blob);
        proj.images[k] = { id: f.id, name: f.name, dataUrl, width: f.width, height: f.height };
      }
    }
    const blob = new Blob([JSON.stringify(proj)], { type: "application/json" });
    triggerDownload(`${state.name || "project"}.themeproj.json`, blob);
  }

  async function handleLoadProject(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const raw = JSON.parse(text);
    const next: ThemeState = {
      name: raw.name,
      version: raw.version,
      colors: raw.colors || {},
      tints: raw.tints || {},
      properties: raw.properties || {},
      images: {},
      _preview: raw._preview,
    };
    for (const k of ["theme_frame", "theme_ntp_background"] as const) {
      const r = raw.images?.[k];
      if (r?.dataUrl) {
        const b = await dataURLToBlob(r.dataUrl);
        next.images[k] = { id: r.id, name: r.name, blob: b, width: r.width, height: r.height };
      }
    }
    // reset by dispatching full state
    (dispatch as any)({ type: "reset", state: next });
    e.currentTarget.value = "";
  }

  return (
    <Stack>
      <Text fw={600}>manifest.json Preview</Text>
      <Code block>{JSON.stringify(manifest, null, 2)}</Code>
      <Group>
        <Button onClick={handleDownloadZip}>Download ZIP</Button>
        <Button variant="light" onClick={handleSaveProject}>
          Save project
        </Button>
        <Button component="label" variant="light">
          Load project
          <input hidden type="file" accept="application/json,.json,.themeproj.json" onChange={handleLoadProject} />
        </Button>
      </Group>
    </Stack>
  );
}
