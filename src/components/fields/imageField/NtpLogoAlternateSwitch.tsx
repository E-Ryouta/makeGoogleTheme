import { Switch } from "@mantine/core";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export function NtpLogoAlternateSwitch({
  imageKey,
}: {
  imageKey: keyof ThemeState["images"];
}) {
  const { state, dispatch } = useTheme();
  if (imageKey !== "theme_ntp_background") return null;

  return (
    <Switch
      label="Alternate NTP"
      checked={Boolean(state.properties.ntp_logo_alternate)}
      onChange={(e) =>
        setProperty(
          dispatch,
          "ntp_logo_alternate",
          e.currentTarget.checked ? 1 : 0,
        )
      }
    />
  );
}
