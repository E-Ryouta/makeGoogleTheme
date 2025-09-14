import { Box, Select } from "@mantine/core";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export function NtpBackgroundRepeatAndLogo({
  imageKey,
  options,
}: {
  imageKey: keyof ThemeState["images"];
  options?: {
    repeat?: boolean;
  };
}) {
  const { state, dispatch } = useTheme();
  if (imageKey !== "theme_ntp_background") return null;

  return (
    <Box>
      {options?.repeat && (
        <Select
          label="繰り返し"
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
      )}
    </Box>
  );
}
