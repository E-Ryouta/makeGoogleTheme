import type { FileRef } from "./fileRef";

export type RGB = [number, number, number]; // 0–255
export type RGBA = [number, number, number, number]; // 0–255 + alpha 0–1

export type ThemeImageKey = keyof ThemeState["images"];
export type ThemeColorKey = keyof ThemeState["colors"];

export type ThemeState = {
  name: string; // manifest.name
  version: string; // manifest.version
  images: {
    theme_frame?: FileRef;
    theme_toolbar?: FileRef;
    theme_tab_background?: FileRef;
    theme_ntp_background?: FileRef;
  };
  colors: {
    // Base/frame
    frame?: RGB | RGBA;
    frame_incognito?: RGB | RGBA;

    // Toolbar
    toolbar?: RGB | RGBA;
    toolbar_text?: RGB | RGBA;
    toolbar_button_icon?: RGB | RGBA;

    // Tabs removed

    // NTP (New Tab Page)
    ntp_background?: RGB | RGBA;
    ntp_text?: RGB | RGBA;
    ntp_link?: RGB | RGBA;

    // Bookmarks bar
    bookmark_text?: RGB | RGBA;

    // Omnibox
    omnibox_background?: RGB | RGBA;
    omnibox_text?: RGB | RGBA;

    // Preview-only legacy/fallback
    button_background?: RGB | RGBA;
  };
  // tints removed
  properties: {
    ntp_background_alignment?:
      | "left"
      | "right"
      | "top"
      | "bottom"
      | "center"
      | "left top"
      | "left center"
      | "left bottom"
      | "center top"
      | "center center"
      | "center bottom"
      | "right top"
      | "right center"
      | "right bottom";
    ntp_background_repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    ntp_background_scale_to_cover?: boolean;
  };
  _preview?: {
    fit?: "cover" | "contain" | "auto";
    position?: string; // "center center" etc.
  };
};

export type ChromeThemeManifest = {
  manifest_version: 3;
  name: string;
  version: string;
  theme: {
    images?: Partial<Record<ThemeImageKey, string>>;
    colors?: Partial<Record<ThemeColorKey, RGB | RGBA>>;
    properties?: {
      ntp_background_alignment?: NonNullable<
        ThemeState["properties"]["ntp_background_alignment"]
      >;
      ntp_background_repeat?: NonNullable<
        ThemeState["properties"]["ntp_background_repeat"]
      >;
    };
  };
};
