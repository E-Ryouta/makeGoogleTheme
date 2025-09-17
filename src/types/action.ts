import type { FileRef } from "./fileRef";
import type { RGB, RGBA, ThemeState } from "./theme";

export type Action =
  | { type: "set_name"; name: string }
  | { type: "set_version"; version: string }
  | { type: "set_color"; key: keyof ThemeState["colors"]; value?: RGB | RGBA }
  | { type: "set_property"; key: keyof ThemeState["properties"]; value?: any }
  | { type: "set_image"; key: keyof ThemeState["images"]; value?: FileRef }
  | { type: "reset"; state: ThemeState }
  | { type: "undo" }
  | { type: "redo" };
