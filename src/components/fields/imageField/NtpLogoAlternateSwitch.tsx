import { Switch } from "@mantine/core";
import { setProperty, useTheme } from "../../../store/themeStore";

export function NtpLogoAlternateSwitch() {
  const { state, dispatch } = useTheme();

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
