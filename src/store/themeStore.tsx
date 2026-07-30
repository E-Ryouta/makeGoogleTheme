import { createContext, useContext, useMemo, useReducer } from "react";
import { validateImageFile } from "../lib/imageValidation";
import type { Action } from "../types/action";
import type { FileRef } from "../types/fileRef";
import type { RGB, RGBA, ThemeState } from "../types/theme";

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
    ntp_background_scale_to_cover: false,
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

export async function setImageWithMeta(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["images"],
  file: File,
): Promise<void> {
  const metadata = await validateImageFile(file);
  const id = crypto.randomUUID();
  const value: FileRef = {
    id,
    name: file.name,
    blob: file,
    width: metadata.width,
    height: metadata.height,
  };
  dispatch({ type: "set_image", key, value });
}

export function setColor(
  dispatch: React.Dispatch<Action>,
  key: keyof ThemeState["colors"],
  value?: RGB | RGBA,
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
