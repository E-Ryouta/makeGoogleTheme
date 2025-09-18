import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { FlipHorizontal, FlipVertical, RefreshCcw } from "lucide-react";
import type { EditorLayer, LayerCropSide } from "./editorLayerModel";

type NtpBackgroundEditorInspectorProps = {
  layer: EditorLayer;
  onChangePosition: (
    layerId: string,
    updates: { x?: number; y?: number },
  ) => void;
  onChangeScale: (layerId: string, value: number) => void;
  onChangeOpacity: (layerId: string, value: number) => void;
  onChangeRotation: (layerId: string, value: number) => void;
  onToggleFlip: (layerId: string, axis: "horizontal" | "vertical") => void;
  onChangeCrop: (layerId: string, side: LayerCropSide, value: number) => void;
  onReset: (layerId: string) => void;
};

export function NtpBackgroundEditorInspector({
  layer,
  onChangePosition,
  onChangeScale,
  onChangeOpacity,
  onChangeRotation,
  onToggleFlip,
  onChangeCrop,
  onReset,
}: NtpBackgroundEditorInspectorProps) {
  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">
        選択中: {layer.name}
      </Text>
      <Group gap="xs" grow>
        <Box w={110}>
          <NumberInput
            label="X"
            size="xs"
            value={Math.round(layer.x)}
            onChange={(value) => {
              if (typeof value === "number" && Number.isFinite(value)) {
                onChangePosition(layer.id, { x: value });
              }
            }}
          />
        </Box>
        <Box w={110}>
          <NumberInput
            label="Y"
            size="xs"
            value={Math.round(layer.y)}
            onChange={(value) => {
              if (typeof value === "number" && Number.isFinite(value)) {
                onChangePosition(layer.id, { y: value });
              }
            }}
          />
        </Box>
      </Group>
      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            拡大率 ( {layer.scale.toFixed(2)} )
          </Text>
        </Group>
        <Slider
          min={0.1}
          max={4}
          step={0.01}
          value={layer.scale}
          onChange={(value) => onChangeScale(layer.id, value)}
        />
      </Stack>
      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            不透明度 ( {Math.round(layer.opacity * 100)}% )
          </Text>
        </Group>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={layer.opacity}
          onChange={(value) => onChangeOpacity(layer.id, value)}
        />
      </Stack>
      <Stack gap={4}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            回転 ({Math.round((layer.rotation * 180) / Math.PI)}°)
          </Text>
        </Group>
        <Slider
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 180}
          value={layer.rotation}
          onChange={(value) => onChangeRotation(layer.id, value)}
        />
      </Stack>
      <Stack gap={4}>
        <Text size="xs" c="dimmed">
          反転
        </Text>
        <Group gap="xs">
          <ActionIcon
            variant={layer.flipHorizontal ? "filled" : "default"}
            color={layer.flipHorizontal ? "blue" : undefined}
            size="sm"
            onClick={() => onToggleFlip(layer.id, "horizontal")}
            aria-label="左右反転"
          >
            <FlipHorizontal size={16} />
          </ActionIcon>
          <ActionIcon
            variant={layer.flipVertical ? "filled" : "default"}
            color={layer.flipVertical ? "blue" : undefined}
            size="sm"
            onClick={() => onToggleFlip(layer.id, "vertical")}
            aria-label="上下反転"
          >
            <FlipVertical size={16} />
          </ActionIcon>
        </Group>
      </Stack>
      <CropSlider
        label="切り抜き (左)"
        value={layer.crop.left}
        onChange={(value) => onChangeCrop(layer.id, "left", value)}
      />
      <CropSlider
        label="切り抜き (右)"
        value={layer.crop.right}
        onChange={(value) => onChangeCrop(layer.id, "right", value)}
      />
      <CropSlider
        label="切り抜き (上)"
        value={layer.crop.top}
        onChange={(value) => onChangeCrop(layer.id, "top", value)}
      />
      <CropSlider
        label="切り抜き (下)"
        value={layer.crop.bottom}
        onChange={(value) => onChangeCrop(layer.id, "bottom", value)}
      />
      <Group justify="flex-end">
        <Button
          variant="subtle"
          size="xs"
          leftSection={<RefreshCcw size={16} />}
          onClick={() => onReset(layer.id)}
        >
          レイヤーをリセット
        </Button>
      </Group>
    </Stack>
  );
}

function CropSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="xs">{Math.round(value * 100)}%</Text>
      </Group>
      <Slider
        min={0}
        max={0.45}
        step={0.01}
        value={value}
        onChange={onChange}
      />
    </Stack>
  );
}
