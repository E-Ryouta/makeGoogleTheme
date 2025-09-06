export type RGB = [number, number, number]; // 0–255
export type RGBA = [number, number, number, number]; // 0–255 + alpha 0–1
export type Tint = [number, number, number]; // [h, s, l] in 0–1

export type FileRef = {
  id: string; // internal
  name: string; // exported filename
  blob: Blob;
  width?: number;
  height?: number;
};

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
    frame_inactive?: RGB | RGBA;
    frame_incognito?: RGB | RGBA;
    frame_incognito_inactive?: RGB | RGBA;

    // Toolbar
    toolbar?: RGB | RGBA;
    toolbar_text?: RGB | RGBA;
    toolbar_button_icon?: RGB | RGBA;

    // Tabs
    tab_text?: RGB | RGBA; // active tab title
    tab_background_text?: RGB | RGBA; // inactive tab title
    tab_background_text_inactive?: RGB | RGBA;
    tab_background_text_incognito?: RGB | RGBA;
    tab_background_text_incognito_inactive?: RGB | RGBA;
    background_tab?: RGB | RGBA; // inactive tab background
    background_tab_inactive?: RGB | RGBA;
    background_tab_incognito?: RGB | RGBA;
    background_tab_incognito_inactive?: RGB | RGBA;

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
  tints: {
    buttons?: Tint;
  };
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
    ntp_logo_alternate?: 0 | 1 | boolean; // manifest only
  };
  _preview?: {
    fit?: "cover" | "contain" | "auto";
    position?: string; // "center center" etc.
  };
};

export type SlotKey =
  | "frame"
  | "toolbar"
  | "tab_background_text"
  | "bookmark_text"
  | "ntp_background"
  | "ntp_text"
  | "ntp_link"
  | "buttons_tint"
  | "omnibox_background"
  | "omnibox_text"
  | "toolbar_text"
  | "background_tab";
