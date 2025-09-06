import { ThemeState } from "../types/theme";

export function buildManifest(state: ThemeState) {
  const { name, version, images, colors, tints, properties } = state;
  const m: any = { manifest_version: 3, name, version, theme: {} };

  if (images && Object.keys(images).length) {
    m.theme.images = {};
    if (images.theme_frame) {
      m.theme.images.theme_frame = `images/${images.theme_frame.name}`;
    }
    if (images.theme_toolbar) {
      m.theme.images.theme_toolbar = `images/${images.theme_toolbar.name}`;
    }
    if (images.theme_tab_background) {
      m.theme.images.theme_tab_background = `images/${images.theme_tab_background.name}`;
    }
    if (images.theme_ntp_background) {
      m.theme.images.theme_ntp_background = `images/${images.theme_ntp_background.name}`;
    }
  }

  if (colors && Object.keys(colors).length) {
    m.theme.colors = {};
    Object.entries(colors).forEach(([k, v]) => v && (m.theme.colors[k] = v));
  }

  if (tints && Object.keys(tints).length) {
    m.theme.tints = {};
    Object.entries(tints).forEach(([k, v]) => v && (m.theme.tints[k] = v));
  }

  const props: any = {};
  if (properties?.ntp_background_alignment) props.ntp_background_alignment = properties.ntp_background_alignment;
  if (properties?.ntp_background_repeat) props.ntp_background_repeat = properties.ntp_background_repeat;
  if (Object.keys(props).length) m.theme.properties = props;

  return m;
}
