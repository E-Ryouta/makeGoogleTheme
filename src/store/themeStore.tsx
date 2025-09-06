import React, { createContext, useContext, useMemo, useReducer, useState } from "react";
import { RGB, RGBA, ThemeState, Tint, FileRef, SlotKey } from "../types/theme";

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

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
      return { ...state, colors: { ...state.colors, [action.key]: action.value } };
    case "set_tint":
      return { ...state, tints: { ...state.tints, [action.key]: action.value } };
    case "set_property":
      return { ...state, properties: { ...state.properties, [action.key]: action.value } };
    case "set_image":
      return { ...state, images: { ...state.images, [action.key]: action.value } };
    case "reset":
      return action.state;
    default:
      return state;
  }
}

function historyReducer(history: History<ThemeState>, action: Action): History<ThemeState> {
  switch (action.type) {
    case "undo": {
      const { past, present, future } = history;
      if (past.length === 0) return history;
      const prev = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return { past: newPast, present: prev, future: [present, ...future] };
    }
    case "redo": {
      const { past, present, future } = history;
      if (future.length === 0) return history;
      const next = future[0];
      const newFuture = future.slice(1);
      return { past: [...past, present], present: next, future: newFuture };
    }
    default: {
      const newPresent = reducePresent(history.present, action);
      if (newPresent === history.present) return history;
      return { past: [...history.past, history.present], present: newPresent, future: [] };
    }
  }
}

const initialTheme: ThemeState = {
  name: "新しいテーマ",
  version: "1.0.0",
  images: {},
  colors: {
    frame: [34, 34, 34],
    toolbar: [24, 24, 24],
    tab_text: [255, 255, 255],
    tab_background_text: [220, 220, 220],
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
  history: History<ThemeState>;
  dispatch: React.Dispatch<Action>;
  undo: () => void;
  redo: () => void;
  setSelectedSlot: (s: SlotKey | null) => void;
  selectedSlot: SlotKey | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialTheme,
    future: [],
  });
  const [selectedSlot, setSelectedSlot] = useState<SlotKey | null>(null);

  const value = useMemo<ThemeContextValue>(
    () => ({
      history,
      dispatch,
      undo: () => dispatch({ type: "undo" }),
      redo: () => dispatch({ type: "redo" }),
      selectedSlot,
      setSelectedSlot,
    }),
    [history, selectedSlot]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return {
    state: ctx.history.present,
    dispatch: ctx.dispatch,
    undo: ctx.undo,
    redo: ctx.redo,
  };
}

export function useSelectedSlot() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useSelectedSlot must be used inside ThemeProvider");
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
      const value: FileRef = { id, name, blob, width: img.width, height: img.height };
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

export function resetTheme(dispatch: React.Dispatch<Action>, state: ThemeState) {
  dispatch({ type: "reset", state });
}
