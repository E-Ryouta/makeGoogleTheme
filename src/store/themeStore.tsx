import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { RGB, RGBA, ThemeState, Tint } from "../types/theme";
import type { FileRef } from "../types/fileRef";
import type { SlotKey } from "../types/slotkey";

type Action =
  | { type: "set_name"; name: string }
  | { type: "set_version"; version: string }
  | { type: "set_color"; key: keyof ThemeState["colors"]; value?: RGB | RGBA }
  | { type: "set_tint"; key: keyof ThemeState["tints"]; value?: Tint }
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
    case "set_tint":
      return {
        ...state,
        tints: { ...state.tints, [action.key]: action.value },
      };
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
  name: "new _theme",
  version: "1.0.0",
  images: {},
  colors: {
    frame: [34, 34, 34],
    toolbar: [24, 24, 24],
    bookmark_text: [240, 240, 240],
    ntp_background: [255, 255, 255],
    ntp_text: [20, 20, 20],
    ntp_link: [0, 100, 220],
    button_background: [101, 101, 255],
  },
  tints: {},
  properties: {
    ntp_background_alignment: "center",
    ntp_background_repeat: "no-repeat",
  },
};

type ThemeContextValue = {
  history: ThemeState;
  dispatch: React.Dispatch<Action>;
  setSelectedSlot: (s: SlotKey | null) => void;
  selectedSlot: SlotKey | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(reducePresent, initialTheme);
  const [selectedSlot, setSelectedSlot] = useState<SlotKey | null>(null);

  const value = useMemo<ThemeContextValue>(
    () => ({
      history,
      dispatch,
      selectedSlot,
      setSelectedSlot,
    }),
    [history, selectedSlot],
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
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useSelectedSlot must be used inside ThemeProvider");
  return {
    selectedSlot: ctx.selectedSlot,
    setSelectedSlot: ctx.setSelectedSlot,
  };
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

export function setTint(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["tints"],
  value?: Tint,
) {
  dispatch({ type: "set_tint", key, value });
}

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
