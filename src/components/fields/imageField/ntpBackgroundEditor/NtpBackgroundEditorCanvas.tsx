import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { Layers3, MousePointer2 } from "lucide-react";
import { useMemo } from "react";
import { TrashIcon } from "../../../icons/TrashIcon";
import type { EditorLayer } from "./editorLayerModel";

type NtpBackgroundEditorCanvasProps = {
  layers: EditorLayer[];
  selectedLayerId: string | null;
  draggingLayerId: string | null;
  outputWidth: number;
  outputHeight: number;
  onUpdateWidth: (value: number) => void;
  onUpdateHeight: (value: number) => void;
  onAddFiles: (files: FileList | null) => void;
  onClearLayers: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
  onLayerPointerDown: (
    layerId: string,
  ) => (event: React.PointerEvent<HTMLDivElement>) => void;
  onLayerPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onLayerPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
};

export function NtpBackgroundEditorCanvas({
  layers,
  selectedLayerId,
  draggingLayerId,
  outputWidth,
  outputHeight,
  onUpdateWidth,
  onUpdateHeight,
  onAddFiles,
  onClearLayers,
  canvasRef,
  canvasWrapperRef,
  onLayerPointerDown,
  onLayerPointerMove,
  onLayerPointerUp,
}: NtpBackgroundEditorCanvasProps) {
  const viewportStyle = useMemo(() => {
    const safeWidth = Math.max(1, outputWidth);
    const safeHeight = Math.max(1, outputHeight);
    return {
      position: "relative" as const,
      width: "100%",
      aspectRatio: `${safeWidth} / ${safeHeight}`,
      border: "1px solid var(--mantine-color-gray-4)",
      borderRadius: 8,
      backgroundSize: "32px 32px, 32px 32px",
      backgroundPosition: "0 0, 16px 16px",
      backgroundImage:
        "linear-gradient(45deg, var(--mantine-color-gray-1) 25%, transparent 25%)," +
        "linear-gradient(-45deg, var(--mantine-color-gray-1) 25%, transparent 25%)",
      overflow: "hidden" as const,
      touchAction: "none" as const,
    };
  }, [outputWidth, outputHeight]);

  const renderLayerPreview = (layer: EditorLayer) => {
    const cropLeft = layer.naturalWidth * layer.crop.left;
    const cropRight = layer.naturalWidth * layer.crop.right;
    const cropTop = layer.naturalHeight * layer.crop.top;
    const cropBottom = layer.naturalHeight * layer.crop.bottom;
    const sourceWidth = Math.max(1, layer.naturalWidth - cropLeft - cropRight);
    const sourceHeight = Math.max(
      1,
      layer.naturalHeight - cropTop - cropBottom,
    );
    const drawWidth = sourceWidth * layer.scale;
    const drawHeight = sourceHeight * layer.scale;
    const widthPercent = outputWidth > 0 ? (drawWidth / outputWidth) * 100 : 0;
    const heightPercent =
      outputHeight > 0 ? (drawHeight / outputHeight) * 100 : 0;
    const leftPercent = outputWidth > 0 ? (layer.x / outputWidth) * 100 : 0;
    const topPercent = outputHeight > 0 ? (layer.y / outputHeight) * 100 : 0;
    const isSelected = layer.id === selectedLayerId;
    const isDragging = layer.id === draggingLayerId;

    return (
      <Box
        key={layer.id}
        style={{
          position: "absolute",
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          width: `${widthPercent}%`,
          height: `${heightPercent}%`,
          outline: isSelected
            ? "2px solid var(--mantine-color-blue-4)"
            : "1px solid transparent",
          cursor: isDragging ? "grabbing" : "grab",
          borderRadius: 6,
          backgroundColor: isSelected
            ? "rgba(51, 154, 240, 0.12)"
            : "transparent",
          boxShadow: isSelected
            ? "0 0 0 1px rgba(51, 154, 240, 0.4) inset"
            : "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        }}
        onPointerDown={onLayerPointerDown(layer.id)}
        onPointerMove={onLayerPointerMove}
        onPointerUp={onLayerPointerUp}
      />
    );
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Group gap="xs">
          <Button
            component="label"
            variant="light"
            size="xs"
            leftSection={<MousePointer2 size={16} />}
          >
            画像を追加
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                onAddFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </Button>
          <Tooltip label="すべてのレイヤーを削除" openDelay={300}>
            <ActionIcon
              variant="default"
              size="sm"
              aria-label="すべてのレイヤーを削除"
              onClick={onClearLayers}
              disabled={layers.length === 0}
            >
              <TrashIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group gap="xs">
          <Box w={120}>
            <NumberInput
              label="幅"
              size="xs"
              value={outputWidth}
              min={100}
              max={6000}
              step={10}
              onChange={(value) => {
                if (typeof value === "number" && Number.isFinite(value)) {
                  onUpdateWidth(value);
                }
              }}
            />
          </Box>
          <Box w={120}>
            <NumberInput
              label="高さ"
              size="xs"
              value={outputHeight}
              min={100}
              max={6000}
              step={10}
              onChange={(value) => {
                if (typeof value === "number" && Number.isFinite(value)) {
                  onUpdateHeight(value);
                }
              }}
            />
          </Box>
        </Group>
      </Group>
      <Box ref={canvasWrapperRef} style={viewportStyle}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <Box
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {layers.map((layer) => renderLayerPreview(layer))}
          {layers.length === 0 && (
            <Stack
              align="center"
              justify="center"
              style={{
                position: "absolute",
                inset: 0,
                color: "var(--mantine-color-gray-5)",
              }}
            >
              <Layers3 size={32} />
              <Text size="sm">ここに画像を追加してください</Text>
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
