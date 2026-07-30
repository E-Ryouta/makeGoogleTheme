import type {
  ChromeThemeManifest,
  RGB,
  RGBA,
  ThemeState,
} from "../types/theme";

export const CHROME_VERSION_PATTERN =
  /^(?=.{1,23}$)(?!0(?:\.0){0,3}$)(?:0|[1-9]\d{0,4})(?:\.(?:0|[1-9]\d{0,4})){0,3}$/;

export function isValidChromeVersion(version: string): boolean {
  if (!CHROME_VERSION_PATTERN.test(version)) return false;
  return version.split(".").every((part) => Number(part) <= 65535);
}

function isValidColor(value: RGB | RGBA): boolean {
  if (value.length !== 3 && value.length !== 4) return false;
  const channels = value.slice(0, 3);
  if (
    !channels.every(
      (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
    )
  ) {
    return false;
  }
  return (
    value.length === 3 ||
    (Number.isFinite(value[3]) && value[3] >= 0 && value[3] <= 1)
  );
}

export function validateThemeState(state: ThemeState): string[] {
  // Chromeが受理しない値をZIP生成前にまとめて検出し、壊れたテーマの配布を防ぐ。
  const errors: string[] = [];
  const name = state.name.trim();
  if (!name) errors.push("name-required");
  if (name.length > 75) errors.push("name-too-long");
  if (!isValidChromeVersion(state.version)) errors.push("version-invalid");
  if (
    Object.values(state.colors).some(
      (color) => color !== undefined && !isValidColor(color),
    )
  ) {
    errors.push("color-invalid");
  }
  return errors;
}

export function buildManifest(state: ThemeState): ChromeThemeManifest {
  // 設定済みの値だけをManifest V3のtheme領域へ写し、余分なキーを出力しない。
  const { name, version, images, colors, properties } = state;
  const manifest: ChromeThemeManifest = {
    manifest_version: 3,
    name: name.trim(),
    version,
    theme: {},
  };

  if (images && Object.keys(images).length) {
    manifest.theme.images = {};
    if (images.theme_frame) {
      manifest.theme.images.theme_frame = "images/theme_frame.png";
    }
    if (images.theme_toolbar) {
      manifest.theme.images.theme_toolbar = "images/theme_toolbar.png";
    }
    if (images.theme_ntp_background) {
      manifest.theme.images.theme_ntp_background =
        "images/theme_ntp_background.png";
    }
    if (images.theme_tab_background) {
      manifest.theme.images.theme_tab_background =
        "images/theme_tab_background.png";
    }
  }

  if (colors && Object.keys(colors).length) {
    manifest.theme.colors = { ...colors };
  }

  const props: NonNullable<ChromeThemeManifest["theme"]["properties"]> = {};
  if (properties?.ntp_background_alignment)
    props.ntp_background_alignment = properties.ntp_background_alignment;
  if (properties?.ntp_background_repeat)
    props.ntp_background_repeat = properties.ntp_background_repeat;
  if (Object.keys(props).length) manifest.theme.properties = props;

  return manifest;
}
