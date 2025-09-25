import { Box, Select } from "@mantine/core";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export type NtpBackgroundRepeatAndLogoProps = {
  label?: string | null;
};

export function NtpBackgroundRepeatAndLogo({
  label,
}: NtpBackgroundRepeatAndLogoProps) {
  const { state, dispatch } = useTheme();
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { label: t("ntpRepeat.options.noRepeat"), value: "no-repeat" },
      { label: t("ntpRepeat.options.repeat"), value: "repeat" },
      { label: t("ntpRepeat.options.repeatX"), value: "repeat-x" },
      { label: t("ntpRepeat.options.repeatY"), value: "repeat-y" },
    ],
    [t],
  );

  const translatedLabel = label === null ? undefined : label ?? t("ntpRepeat.label");

  return (
    <Box>
      <Select
        label={translatedLabel}
        data={options}
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
