import { Select } from "@mantine/core";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export type NtpBackgroundPositionSelectProps = {
  label?: string | null;
};

export function NtpBackgroundPositionSelect({
  label,
}: NtpBackgroundPositionSelectProps) {
  const { state, dispatch } = useTheme();
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { label: t("ntpPosition.options.center"), value: "center" },
      { label: t("ntpPosition.options.left"), value: "left" },
      { label: t("ntpPosition.options.right"), value: "right" },
      { label: t("ntpPosition.options.top"), value: "top" },
      { label: t("ntpPosition.options.bottom"), value: "bottom" },
      { label: t("ntpPosition.options.leftTop"), value: "left top" },
      { label: t("ntpPosition.options.leftBottom"), value: "left bottom" },
      { label: t("ntpPosition.options.rightTop"), value: "right top" },
      { label: t("ntpPosition.options.rightBottom"), value: "right bottom" },
      { label: t("ntpPosition.options.leftCenter"), value: "left center" },
      { label: t("ntpPosition.options.rightCenter"), value: "right center" },
      { label: t("ntpPosition.options.centerTop"), value: "center top" },
      { label: t("ntpPosition.options.centerBottom"), value: "center bottom" },
    ],
    [t],
  );

  const translatedLabel =
    label === null ? undefined : label ?? t("ntpPosition.label");

  return (
    <Select
      label={translatedLabel}
      data={options}
      value={state.properties.ntp_background_alignment}
      onChange={(v) =>
        setProperty(
          dispatch,
          "ntp_background_alignment",
          (v as ThemeState["properties"]["ntp_background_alignment"]) ||
            undefined,
        )
      }
    />
  );
}
