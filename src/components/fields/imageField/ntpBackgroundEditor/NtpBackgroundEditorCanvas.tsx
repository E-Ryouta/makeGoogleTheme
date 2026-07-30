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
import { Layers3, MousePointer2, RotateCw } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_IMAGE_TYPES } from "../../../../lib/imageValidation";
import { TrashIcon } from "../../../icons/TrashIcon";
import type { EditorLayer, LayerCropSide } from "./editorLayerModel";

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
    mode?: "move" | "scale" | "rotate" | "crop",
    cropSide?: LayerCropSide,
  ) => (event: React.PointerEvent<HTMLElement>) => void;
  onLayerPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onLayerPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
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
  const { t } = useTranslation();
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
    const interactionProps = (
      mode: "scale" | "rotate" | "crop",
      cropSide?: LayerCropSide,
    ) => ({
      onPointerDown: onLayerPointerDown(layer.id, mode, cropSide),
      onPointerMove: onLayerPointerMove,
      onPointerUp: onLayerPointerUp,
    });
    const handleStyle = {
      position: "absolute" as const,
      width: 14,
      height: 14,
      border: "2px solid var(--mantine-color-blue-6)",
      borderRadius: "50%",
      background: "white",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.24)",
      zIndex: 3,
      touchAction: "none" as const,
    };

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
          transform: `rotate(${layer.rotation}rad)`,
          transformOrigin: "center",
        }}
        onPointerDown={onLayerPointerDown(layer.id, "move")}
        onPointerMove={onLayerPointerMove}
        onPointerUp={onLayerPointerUp}
      >
        {isSelected && (
          <>
            {/* 四隅は縦横比を保った拡大縮小、四辺中央は画像の切り抜きに使う。 */}
            {[
              { key: "top-left", top: -7, left: -7, cursor: "nwse-resize" },
              { key: "top-right", top: -7, right: -7, cursor: "nesw-resize" },
              {
                key: "bottom-left",
                bottom: -7,
                left: -7,
                cursor: "nesw-resize",
              },
              {
                key: "bottom-right",
                bottom: -7,
                right: -7,
                cursor: "nwse-resize",
              },
            ].map(({ key, ...position }) => (
              <Box
                component="button"
                type="button"
                key={key}
                style={{ ...handleStyle, ...position }}
                aria-label={t("ntpEditor.canvas.scaleLayer", {
                  name: layer.name,
                })}
                {...interactionProps("scale")}
              />
            ))}
            {(
              [
                {
                  side: "left",
                  style: {
                    left: -5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "ew-resize",
                  },
                },
                {
                  side: "right",
                  style: {
                    right: -5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "ew-resize",
                  },
                },
                {
                  side: "top",
                  style: {
                    top: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    cursor: "ns-resize",
                  },
                },
                {
                  side: "bottom",
                  style: {
                    bottom: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    cursor: "ns-resize",
                  },
                },
              ] as const
            ).map(({ side, style }) => (
              <Box
                component="button"
                type="button"
                key={`crop-${side}`}
                style={{
                  position: "absolute",
                  width: side === "left" || side === "right" ? 10 : 28,
                  height: side === "top" || side === "bottom" ? 10 : 28,
                  borderRadius: 5,
                  background: "var(--mantine-color-blue-6)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                  zIndex: 2,
                  touchAction: "none",
                  ...style,
                }}
                aria-label={t("ntpEditor.canvas.cropLayer", {
                  name: layer.name,
                })}
                {...interactionProps("crop", side)}
              />
            ))}
            <Box
              component="button"
              type="button"
              style={{
                position: "absolute",
                left: "50%",
                top: -38,
                width: 2,
                height: 30,
                background: "var(--mantine-color-blue-6)",
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />
            <Box
              style={{
                ...handleStyle,
                width: 22,
                height: 22,
                left: "50%",
                top: -52,
                transform: "translateX(-50%)",
                display: "grid",
                placeItems: "center",
                cursor: "grab",
                color: "var(--mantine-color-blue-7)",
              }}
              aria-label={t("ntpEditor.canvas.rotateLayer", {
                name: layer.name,
              })}
              {...interactionProps("rotate")}
            >
              <RotateCw size={13} />
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Group gap="xs" style={{ alignSelf: "flex-end" }}>
          <Button
            component="label"
            variant="light"
            size="xs"
            leftSection={<MousePointer2 size={16} />}
          >
            {t("ntpEditor.canvas.addImages")}
            <input
              hidden
              type="file"
              accept={SUPPORTED_IMAGE_TYPES.join(",")}
              multiple
              onChange={(event) => {
                onAddFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </Button>
          <Tooltip label={t("ntpEditor.canvas.clearAll")} openDelay={300}>
            <ActionIcon
              variant="default"
              size="sm"
              aria-label={t("ntpEditor.canvas.clearAll")}
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
              label={t("ntpEditor.canvas.width")}
              size="xs"
              value={outputWidth}
              min={100}
              max={8192}
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
              label={t("ntpEditor.canvas.height")}
              size="xs"
              value={outputHeight}
              min={100}
              max={8192}
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
              <Text size="sm">{t("ntpEditor.canvas.empty")}</Text>
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
