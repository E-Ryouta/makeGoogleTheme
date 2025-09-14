import { Group, Slider, Text } from "@mantine/core";
import { setTint, useTheme } from "../../store/themeStore";
import { ThemeState, Tint } from "../../types/theme";

export default function TintField({
  label,
  tintKey,
}: {
  label: string;
  tintKey: keyof ThemeState["tints"];
}) {
  const { state, dispatch } = useTheme();
  const value = state.tints[tintKey] || [0, 0, 0];

  function update(i: number, v: number) {
    const next: Tint = [...value] as Tint;
    next[i] = Number(v);
    setTint(dispatch, tintKey, next);
  }

  return (
    <div>
      <Text mb="xs">{label}</Text>
      <Group>
        <Text w={64}>Hue</Text>
        <Slider
          min={0}
          max={1}
          step={0.01}
          style={{ flex: 1 }}
          value={value[0]}
          onChange={(v) => update(0, v)}
        />
      </Group>
      <Group>
        <Text w={64}>Saturation</Text>
        <Slider
          min={0}
          max={1}
          step={0.01}
          style={{ flex: 1 }}
          value={value[1]}
          onChange={(v) => update(1, v)}
        />
      </Group>
      <Group>
        <Text w={64}>Lightness</Text>
        <Slider
          min={0}
          max={1}
          step={0.01}
          style={{ flex: 1 }}
          value={value[2]}
          onChange={(v) => update(2, v)}
        />
      </Group>
    </div>
  );
}
