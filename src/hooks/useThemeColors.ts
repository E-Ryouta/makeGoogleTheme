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
      ntpBackground: colorToCss(state.colors.ntp_background),
      ntpText: colorToCss(state.colors.ntp_text),
      ntpLink: colorToCss(state.colors.ntp_link),
      omniboxBackground: colorToCss(state.colors.omnibox_background) || "#fff",
      omniboxText: colorToCss(state.colors.omnibox_text) || "#6b7280",
      toolbarText: colorToCss(state.colors.toolbar_text) || "#333",
      toolbarButtonIcon: colorToCss(state.colors.toolbar_button_icon),
      buttonBackground: state.colors.button_background,
    }),
    [state.colors],
  );

  return colors;
}
