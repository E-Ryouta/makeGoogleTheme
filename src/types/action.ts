import type { RGB, RGBA, Tint, ThemeState } from "./theme";
import type { FileRef } from "./fileRef";

export type Action =
  | { type: "set_name"; name: string }
  | { type: "set_version"; version: string }
  | { type: "set_color"; key: keyof ThemeState["colors"]; value?: RGB | RGBA }
  | { type: "set_tint"; key: keyof ThemeState["tints"]; value?: Tint }
  | { type: "set_property"; key: keyof ThemeState["properties"]; value?: any }
  | { type: "set_image"; key: keyof ThemeState["images"]; value?: FileRef }
  | { type: "reset"; state: ThemeState }
  | { type: "undo" }
  | { type: "redo" };
