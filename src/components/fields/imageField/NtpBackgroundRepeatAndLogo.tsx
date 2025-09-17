import { Box, Select } from "@mantine/core";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export type NtpBackgroundRepeatAndLogoProps = {
  label?: string | null;
};

export function NtpBackgroundRepeatAndLogo({
  label = "繰り返し",
}: NtpBackgroundRepeatAndLogoProps) {
  const { state, dispatch } = useTheme();

  return (
    <Box>
      <Select
        label={typeof label === "string" ? label : undefined}
        data={[
          { label: "繰り返さない", value: "no-repeat" },
          { label: "縦横ともに繰り返す", value: "repeat" },
          { label: "水平方向のみ", value: "repeat-x" },
          { label: "垂直方向のみ", value: "repeat-y" },
        ]}
        value={state.properties.ntp_background_repeat}
        onChange={(v) =>
          setProperty(
            dispatch,
            "ntp_background_repeat",
            (v as ThemeState["properties"]["ntp_background_repeat"]) ||
              undefined,
          )
        }
      />
    </Box>
  );
}
