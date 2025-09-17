import { Select } from "@mantine/core";
import { setProperty, useTheme } from "../../../store/themeStore";
import type { ThemeState } from "../../../types/theme";

export type NtpBackgroundPositionSelectProps = {
  label?: string | null;
};

export function NtpBackgroundPositionSelect({
  label = "配置",
}: NtpBackgroundPositionSelectProps) {
  const { state, dispatch } = useTheme();

  return (
    <Select
      label={typeof label === "string" ? label : undefined}
      data={[
        { label: "中央", value: "center" },
        { label: "左", value: "left" },
        { label: "右", value: "right" },
        { label: "上", value: "top" },
        { label: "下", value: "bottom" },
        { label: "左上", value: "left top" },
        { label: "左下", value: "left bottom" },
        { label: "右上", value: "right top" },
        { label: "右下", value: "right bottom" },
        { label: "左中央", value: "left center" },
        { label: "右中央", value: "right center" },
        { label: "中央上", value: "center top" },
        { label: "中央下", value: "center bottom" },
      ]}
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
