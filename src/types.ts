export type RGB = [number, number, number];
export type Tint = [number, number, number]; // [h, s, l] in 0–1

export type FileRef = {
  id: string;      // internal
  name: string;    // exported filename
  blob: Blob;
  width?: number;
  height?: number;
};

export type ThemeState = {
  name: string;          // manifest.name
  version: string;       // manifest.version
  images: {
    theme_frame?: FileRef;
    theme_ntp_background?: FileRef;
  };
  colors: {
    frame?: RGB;
    toolbar?: RGB;
    tab_background_text?: RGB;
    bookmark_text?: RGB;
    ntp_text?: RGB;
    ntp_link?: RGB;
  };
  tints: {
    buttons?: Tint;
  };
  properties: {
    ntp_background_alignment?: "left"|"right"|"top"|"bottom"|"center";
    ntp_background_repeat?: "no-repeat"|"repeat"|"repeat-x"|"repeat-y";
    ntp_background_size?: "auto"|"cover"|"contain";
  };
  _preview?: {
    fit?: "cover"|"contain"|"auto";
    position?: string;
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
 | "buttons_tint";
