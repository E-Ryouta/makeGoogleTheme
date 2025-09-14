import { createContext, useContext, useMemo, useReducer } from "react";
import type { RGB, RGBA, ThemeState } from "../types/theme";
import type { FileRef } from "../types/fileRef";
// setSelectedSlot and SlotKey have been removed from the store

type Action =
  | { type: "set_name"; name: string }
  | { type: "set_version"; version: string }
  | { type: "set_color"; key: keyof ThemeState["colors"]; value?: RGB | RGBA }
  | { type: "set_property"; key: keyof ThemeState["properties"]; value?: any }
  | { type: "set_image"; key: keyof ThemeState["images"]; value?: FileRef }
  | { type: "reset"; state: ThemeState }
  | { type: "undo" }
  | { type: "redo" };

function reducePresent(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "set_name":
      return { ...state, name: action.name };
    case "set_version":
      return { ...state, version: action.version };
    case "set_color":
      return {
        ...state,
        colors: { ...state.colors, [action.key]: action.value },
      };
    // tints removed
    case "set_property":
      return {
        ...state,
        properties: { ...state.properties, [action.key]: action.value },
      };
    case "set_image":
      return {
        ...state,
        images: { ...state.images, [action.key]: action.value },
      };
    case "reset":
      return action.state;
    default:
      return state;
  }
}

const initialTheme: ThemeState = {
  name: "Default",
  version: "1.0",
  images: {},
  colors: {
    frame: [255, 255, 255],
    toolbar: [241, 243, 244],
    // Additional colors can be added by user/import.
  },
  // tints removed
  properties: {
    ntp_background_alignment: "center",
    ntp_background_repeat: "no-repeat",
  },
};

type ThemeContextValue = {
  history: ThemeState;
  dispatch: React.Dispatch<Action>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(reducePresent, initialTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      history,
      dispatch,
    }),
    [history],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return {
    state: ctx.history,
    dispatch: ctx.dispatch,
  };
}

export function useSelectedSlot() {
  throw new Error("useSelectedSlot has been removed");
}

export function setImageWithMeta(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["images"],
  file: File,
) {
  const id = crypto.randomUUID();
  const name = file.name;
  const blob = file as Blob;
  const fr = new FileReader();
  fr.onload = () => {
    // Create an offscreen image to measure dimensions
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const value: FileRef = {
        id,
        name,
        blob,
        width: img.width,
        height: img.height,
      };
      dispatch({ type: "set_image", key, value });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      const value: FileRef = { id, name, blob };
      dispatch({ type: "set_image", key, value });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  fr.readAsArrayBuffer(file); // trigger load
}

export function setColor(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["colors"],
  value?: RGB,
) {
  dispatch({ type: "set_color", key, value });
}

// setTint removed

export function setProperty(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["properties"],
  value?: ThemeState["properties"][typeof key],
) {
  dispatch({ type: "set_property", key, value });
}

export function resetTheme(
  dispatch: React.Dispatch<Action>,
  state: ThemeState,
) {
  dispatch({ type: "reset", state });
}
