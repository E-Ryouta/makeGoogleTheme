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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">
        {t("ntpEditor.inspector.selected", { name: layer.name })}
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
            {t("ntpEditor.inspector.scale", {
              value: layer.scale.toFixed(2),
            })}
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
            {t("ntpEditor.inspector.opacity", {
              value: Math.round(layer.opacity * 100),
            })}
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
            {t("ntpEditor.inspector.rotation", {
              value: Math.round((layer.rotation * 180) / Math.PI),
            })}
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
          {t("ntpEditor.inspector.flip")}
        </Text>
        <Group gap="xs">
          <ActionIcon
            variant={layer.flipHorizontal ? "filled" : "default"}
            color={layer.flipHorizontal ? "blue" : undefined}
            size="sm"
            onClick={() => onToggleFlip(layer.id, "horizontal")}
            aria-label={t("ntpEditor.inspector.flipHorizontal")}
          >
            <FlipHorizontal size={16} />
          </ActionIcon>
          <ActionIcon
            variant={layer.flipVertical ? "filled" : "default"}
            color={layer.flipVertical ? "blue" : undefined}
            size="sm"
            onClick={() => onToggleFlip(layer.id, "vertical")}
            aria-label={t("ntpEditor.inspector.flipVertical")}
          >
            <FlipVertical size={16} />
          </ActionIcon>
        </Group>
      </Stack>
      <CropSlider
        label={t("ntpEditor.inspector.cropLeft")}
        value={layer.crop.left}
        onChange={(value) => onChangeCrop(layer.id, "left", value)}
      />
      <CropSlider
        label={t("ntpEditor.inspector.cropRight")}
        value={layer.crop.right}
        onChange={(value) => onChangeCrop(layer.id, "right", value)}
      />
      <CropSlider
        label={t("ntpEditor.inspector.cropTop")}
        value={layer.crop.top}
        onChange={(value) => onChangeCrop(layer.id, "top", value)}
      />
      <CropSlider
        label={t("ntpEditor.inspector.cropBottom")}
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
          {t("ntpEditor.inspector.reset")}
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
