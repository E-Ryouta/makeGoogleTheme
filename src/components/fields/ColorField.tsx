import { Group, Slider, Text, TextInput } from "@mantine/core";
import { useTheme, setColor } from "../../store/themeStore";
import { hexToRgb, rgbToHex } from "../../lib/color";
import { ThemeState, RGB, RGBA } from "../../types/theme";

type ColorKey = keyof ThemeState["colors"];

export default function ColorField({
  label,
  colorKey,
  alpha = true,
}: {
  label: string;
  colorKey: ColorKey;
  alpha?: boolean;
}) {
  const { state, dispatch } = useTheme();
  const value = state.colors[colorKey] as RGB | RGBA | undefined;
  const rgb: RGB | undefined = value
    ? ([value[0], value[1], value[2]] as RGB)
    : undefined;
  const a: number =
    value && (value as any).length === 4 ? ((value as RGBA)[3] ?? 1) : 1;
  const hex = rgbToHex(rgb);

  return (
    <Group gap="sm" align="center">
      <Text w={160}>{label}</Text>
      <input
        type="color"
        value={hex || "#000000"}
        onChange={(e) => {
          const base = hexToRgb(e.target.value);
          if (!base) return setColor(dispatch, colorKey, undefined);
          if (alpha)
            setColor(
              dispatch,
              colorKey as any,
              [base[0], base[1], base[2], a] as any,
            );
          else setColor(dispatch, colorKey as any, base as any);
        }}
      />
      <TextInput
        style={{ flex: 1 }}
        value={hex}
        onChange={(e) => {
          const base = hexToRgb(e.target.value);
          if (!base) return setColor(dispatch, colorKey, undefined);
          if (alpha)
            setColor(
              dispatch,
              colorKey as any,
              [base[0], base[1], base[2], a] as any,
            );
          else setColor(dispatch, colorKey as any, base as any);
        }}
      />
      {alpha && (
        <Group gap={6} w={200} align="center">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={a}
            onChange={(v) => {
              const base = rgb || [0, 0, 0];
              setColor(
                dispatch,
                colorKey as any,
                [base[0], base[1], base[2], Number(v)] as any,
              );
            }}
            style={{ flex: 1 }}
          />
          <Text w={36} ta="right" size="sm">
            {Math.round(a * 100)}%
          </Text>
        </Group>
      )}
    </Group>
  );
}
