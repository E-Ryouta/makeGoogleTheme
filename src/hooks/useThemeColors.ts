import { useMemo } from "react";
import { colorToCss } from "../lib/color";
import { useTheme } from "../store/themeStore";

export function useThemeColors() {
  const { state } = useTheme();

  const colors = useMemo(
    () => ({
      frame: colorToCss(state.colors.frame),
      toolbar: colorToCss(state.colors.toolbar),
      bookmarkText: colorToCss(state.colors.bookmark_text),
      ntpBackground: colorToCss((state.colors as any).ntp_background),
      ntpText: colorToCss(state.colors.ntp_text),
      ntpLink: colorToCss(state.colors.ntp_link),
      omniboxBackground:
        colorToCss((state.colors as any).omnibox_background) || "#fff",
      omniboxText: colorToCss((state.colors as any).omnibox_text) || "#6b7280",
      toolbarText: colorToCss((state.colors as any).toolbar_text) || "#333",
      toolbarButtonIcon: colorToCss((state.colors as any).toolbar_button_icon),
      buttonBackground: (state.colors as any).button_background,
    }),
    [state.colors],
  );

  return colors;
}
