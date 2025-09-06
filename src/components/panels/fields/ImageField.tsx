import { Button, Group, Select, Stack, Switch, Text } from "@mantine/core";
import { setImageWithMeta, setProperty, useTheme } from "../../../store/themeStore";
import { ThemeState } from "../../../types/theme";

export default function ImageField({
  label,
  imageKey,
  options,
}: {
  label: string;
  imageKey: keyof ThemeState["images"];
  options?: {
    position?: boolean;
    repeat?: boolean;
  };
}) {
  const { state, dispatch } = useTheme();
  const current = state.images[imageKey];

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text>{label}</Text>
        <Button component="label" variant="light" size="xs">
          Choose file
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setImageWithMeta(dispatch, imageKey, f);
            }}
          />
        </Button>
      </Group>
      {current && (
        <Text size="sm" c="dimmed">
          {current.name} {current.width && current.height ? `(${current.width}×${current.height})` : ""}
        </Text>
      )}
      {imageKey === "theme_ntp_background" && (
        <Group>
          {options?.repeat && (
            <Select
              label="Repeat"
              data={[
                { label: "No repeat", value: "no-repeat" },
                { label: "Both directions", value: "repeat" },
                { label: "Horizontal only", value: "repeat-x" },
                { label: "Vertical only", value: "repeat-y" },
              ]}
              value={state.properties.ntp_background_repeat}
              onChange={(v) => setProperty(dispatch, "ntp_background_repeat", (v as any) || undefined)}
            />
          )}
          {options?.position && (
            <Select
              label="Alignment"
              data={[
                { label: "Center", value: "center" },
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
                { label: "Top", value: "top" },
                { label: "Bottom", value: "bottom" },
                { label: "Left top", value: "left top" },
                { label: "Left bottom", value: "left bottom" },
                { label: "Right top", value: "right top" },
                { label: "Right bottom", value: "right bottom" },
                { label: "Left center", value: "left center" },
                { label: "Right center", value: "right center" },
                { label: "Center top", value: "center top" },
                { label: "Center bottom", value: "center bottom" },
              ]}
              value={state.properties.ntp_background_alignment}
              onChange={(v) => setProperty(dispatch, "ntp_background_alignment", (v as any) || undefined)}
            />
          )}
          <Text size="xs" c="dimmed">
            画像サイズはmanifestで変更不可のため、プレビューは「実寸・中央寄せ」で表示します（position/repeatの指定のみ反映）。
          </Text>
          <Switch
            label="Alternate NTP logo"
            checked={Boolean(state.properties.ntp_logo_alternate)}
            onChange={(e) => setProperty(dispatch, "ntp_logo_alternate", e.currentTarget.checked ? 1 : 0)}
          />
        </Group>
      )}
    </Stack>
  );
}
