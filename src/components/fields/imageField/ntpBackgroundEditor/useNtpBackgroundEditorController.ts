import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  assertEditorLayerCapacity,
  assertSafeCanvasSize,
  IMAGE_LIMITS,
  ImageValidationError,
  validateImageFile,
} from "../../../../lib/imageValidation";
import { setImageWithMeta } from "../../../../store/themeStore";
import type { Action } from "../../../../types/action";
import type { FileRef } from "../../../../types/fileRef";
import type { EditorLayer, FlipAxis, LayerCropSide } from "./editorLayerModel";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "./editorLayerModel";
import {
  clampCrop,
  createLayerFromBlob,
  drawLayerOntoContext,
  ensureCachedImage,
} from "./editorLayerRendering";

type UseNtpBackgroundEditorControllerArgs = {
  opened: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  current?: FileRef;
};

type DragState = {
  layerId: string;
  pointerId: number;
  mode: "move" | "scale" | "rotate" | "crop";
  cropSide?: LayerCropSide;
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  startDistance: number;
  startAngle: number;
  initialLayer: EditorLayer;
};

function visibleLayerSize(layer: EditorLayer) {
  return {
    width:
      layer.naturalWidth *
      (1 - layer.crop.left - layer.crop.right) *
      layer.scale,
    height:
      layer.naturalHeight *
      (1 - layer.crop.top - layer.crop.bottom) *
      layer.scale,
  };
}

function clampScale(scale: number) {
  return Math.max(0.05, Math.min(8, scale));
}

export function useNtpBackgroundEditorController({
  opened,
  onClose,
  dispatch,
  current,
}: UseNtpBackgroundEditorControllerArgs) {
  const { t } = useTranslation();
  const [layers, setLayers] = useState<EditorLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [outputWidth, setOutputWidth] = useState<number>(DEFAULT_WIDTH);
  const [outputHeight, setOutputHeight] = useState<number>(DEFAULT_HEIGHT);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const frameRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedLayerId) ?? null,
    [layers, selectedLayerId],
  );

  const validationMessage = useCallback(
    (error: unknown) => {
      const key =
        error instanceof ImageValidationError ? error.code : "decode-failed";
      return t(`imageValidation.${key}`);
    },
    [t],
  );

  useEffect(() => {
    if (!opened) {
      setLayers([]);
      setSelectedLayerId(null);
      setOutputWidth(DEFAULT_WIDTH);
      setOutputHeight(DEFAULT_HEIGHT);
      setErrorMessage(null);
      imageCacheRef.current.clear();
      return;
    }

    let cancelled = false;

    const init = async () => {
      const baseWidth = current?.width ?? DEFAULT_WIDTH;
      const baseHeight = current?.height ?? DEFAULT_HEIGHT;
      setOutputWidth(baseWidth);
      setOutputHeight(baseHeight);

      if (!current) return;

      try {
        const initialLayer = await createLayerFromBlob(
          current.blob,
          current.name,
          baseWidth,
          baseHeight,
        );
        if (cancelled) return;
        setLayers([initialLayer]);
        setSelectedLayerId(initialLayer.id);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setErrorMessage(t("ntpEditor.errors.loadExisting"));
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [opened, current, t]);

  useEffect(() => {
    if (!opened) return;
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setDragState(null);
    };
    wrapper.addEventListener("pointerup", handlePointerUp);
    wrapper.addEventListener("pointerleave", handlePointerUp);

    return () => {
      wrapper.removeEventListener("pointerup", handlePointerUp);
      wrapper.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const scheduleRender = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(async () => {
        const requestedRatio = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(outputWidth));
        const height = Math.max(1, Math.round(outputHeight));
        const safeRatio = Math.sqrt(
          IMAGE_LIMITS.maxPixels / Math.max(1, width * height),
        );
        const ratio = Math.max(1, Math.min(requestedRatio, safeRatio));
        const deviceWidth = width * ratio;
        const deviceHeight = height * ratio;

        if (canvas.width !== deviceWidth || canvas.height !== deviceHeight) {
          canvas.width = deviceWidth;
          canvas.height = deviceHeight;
          canvas.style.width = "100%";
          canvas.style.height = "100%";
        }

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        try {
          const images = await Promise.all(
            layers.map((layer) =>
              ensureCachedImage(imageCacheRef.current, layer.src),
            ),
          );
          if (cancelled) return;
          ctx.clearRect(0, 0, width, height);
          layers.forEach((layer, index) => {
            drawLayerOntoContext(ctx, layer, images[index]);
          });
        } catch (error) {
          console.error(error);
        }
        frameRef.current = null;
      });
    };

    scheduleRender();

    return () => {
      cancelled = true;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [opened, layers, outputWidth, outputHeight]);

  const selectLayer = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
  }, []);

  const setOutputWidthValue = useCallback((value: number) => {
    setOutputWidth(
      Math.min(IMAGE_LIMITS.maxDimension, Math.max(100, Math.round(value))),
    );
  }, []);

  const setOutputHeightValue = useCallback((value: number) => {
    setOutputHeight(
      Math.min(IMAGE_LIMITS.maxDimension, Math.max(100, Math.round(value))),
    );
  }, []);

  const updateLayer = useCallback(
    (layerId: string, updater: (layer: EditorLayer) => EditorLayer) => {
      setLayers((prev) =>
        prev.map((layer) => (layer.id === layerId ? updater(layer) : layer)),
      );
    },
    [],
  );

  const setLayerPosition = useCallback(
    (layerId: string, partial: { x?: number; y?: number }) => {
      updateLayer(layerId, (layer) => ({ ...layer, ...partial }));
    },
    [updateLayer],
  );

  const setLayerScale = useCallback(
    (layerId: string, scale: number) => {
      updateLayer(layerId, (layer) => ({ ...layer, scale }));
    },
    [updateLayer],
  );

  const setLayerRotation = useCallback(
    (layerId: string, rotation: number) => {
      updateLayer(layerId, (layer) => ({ ...layer, rotation }));
    },
    [updateLayer],
  );

  const setLayerOpacity = useCallback(
    (layerId: string, opacity: number) => {
      updateLayer(layerId, (layer) => ({ ...layer, opacity }));
    },
    [updateLayer],
  );

  const toggleLayerFlip = useCallback(
    (layerId: string, axis: FlipAxis) => {
      updateLayer(layerId, (layer) =>
        axis === "horizontal"
          ? { ...layer, flipHorizontal: !layer.flipHorizontal }
          : { ...layer, flipVertical: !layer.flipVertical },
      );
    },
    [updateLayer],
  );

  const setLayerCrop = useCallback(
    (layerId: string, side: LayerCropSide, value: number) => {
      updateLayer(layerId, (layer) => {
        const oppositeSide =
          side === "left"
            ? "right"
            : side === "right"
              ? "left"
              : side === "top"
                ? "bottom"
                : "top";
        const nextValue = clampCrop(value, layer.crop[oppositeSide]);
        return {
          ...layer,
          crop: { ...layer.crop, [side]: nextValue },
        };
      });
    },
    [updateLayer],
  );

  const handleAddFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const nextLayers: EditorLayer[] = [];
      setErrorMessage(null);

      try {
        assertEditorLayerCapacity(layers.length, files.length);
      } catch (error) {
        setErrorMessage(validationMessage(error));
        return;
      }

      for (const file of Array.from(files)) {
        try {
          await validateImageFile(file);
          const layer = await createLayerFromBlob(
            file,
            file.name,
            outputWidth,
            outputHeight,
          );
          nextLayers.push(layer);
        } catch (error) {
          console.error(error);
          const reason = validationMessage(error);
          setErrorMessage(
            t("ntpEditor.errors.loadFileWithReason", {
              fileName: file.name,
              reason,
            }),
          );
        }
      }

      if (nextLayers.length === 0) return;

      setLayers((prev) => [...prev, ...nextLayers]);
      setSelectedLayerId(nextLayers[nextLayers.length - 1]?.id ?? null);
    },
    [layers.length, outputWidth, outputHeight, t, validationMessage],
  );

  const clearLayers = useCallback(() => {
    setLayers([]);
    setSelectedLayerId(null);
  }, []);

  const removeLayer = useCallback(
    (layerId: string) => {
      setLayers((prev) => {
        const next = prev.filter((layer) => layer.id !== layerId);
        if (selectedLayerId === layerId) {
          setSelectedLayerId(next[next.length - 1]?.id ?? null);
        }
        return next;
      });
    },
    [selectedLayerId],
  );

  const bringForward = useCallback((layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((layer) => layer.id === layerId);
      if (index === -1 || index === prev.length - 1) return prev;
      const next = [...prev];
      const [layer] = next.splice(index, 1);
      next.splice(index + 1, 0, layer);
      return next;
    });
  }, []);

  const sendBackward = useCallback((layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((layer) => layer.id === layerId);
      if (index <= 0) return prev;
      const next = [...prev];
      const [layer] = next.splice(index, 1);
      next.splice(index - 1, 0, layer);
      return next;
    });
  }, []);

  const resetLayerAdjustments = useCallback(
    (layerId: string) => {
      updateLayer(layerId, (layer) => ({
        ...layer,
        x: (outputWidth - layer.naturalWidth * layer.scale) / 2,
        y: (outputHeight - layer.naturalHeight * layer.scale) / 2,
        crop: { left: 0, right: 0, top: 0, bottom: 0 },
      }));
    },
    [updateLayer, outputWidth, outputHeight],
  );

  const handleLayerPointerDown = useCallback(
    (
      layerId: string,
      mode: DragState["mode"] = "move",
      cropSide?: LayerCropSide,
    ) =>
      (event: React.PointerEvent<HTMLElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        setSelectedLayerId(layerId);
        const wrapper = canvasWrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const layer = layers.find((item) => item.id === layerId);
        if (!layer) return;

        const pointerX =
          ((event.clientX - rect.left) / Math.max(1, rect.width)) * outputWidth;
        const pointerY =
          ((event.clientY - rect.top) / Math.max(1, rect.height)) *
          outputHeight;
        const size = visibleLayerSize(layer);
        const centerX = layer.x + size.width / 2;
        const centerY = layer.y + size.height / 2;
        event.currentTarget.setPointerCapture(event.pointerId);
        const nextDragState: DragState = {
          layerId,
          pointerId: event.pointerId,
          mode,
          cropSide,
          startX: pointerX,
          startY: pointerY,
          centerX,
          centerY,
          startDistance: Math.max(
            1,
            Math.hypot(pointerX - centerX, pointerY - centerY),
          ),
          startAngle: Math.atan2(pointerY - centerY, pointerX - centerX),
          initialLayer: layer,
        };
        // 再描画を待たず次のpointermoveから操作できるよう、一時状態はrefへも同期する。
        dragStateRef.current = nextDragState;
        setDragState(nextDragState);
      },
    [layers, outputHeight, outputWidth],
  );

  const handleLayerPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const activeDrag = dragStateRef.current;
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      const wrapper = canvasWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      if (outputWidth === 0 || outputHeight === 0) return;
      const pointerX =
        ((event.clientX - rect.left) / Math.max(1, rect.width)) * outputWidth;
      const pointerY =
        ((event.clientY - rect.top) / Math.max(1, rect.height)) * outputHeight;
      const deltaX = pointerX - activeDrag.startX;
      const deltaY = pointerY - activeDrag.startY;

      setLayers((prev) =>
        prev.map((layer) => {
          if (layer.id !== activeDrag.layerId) return layer;
          const initial = activeDrag.initialLayer;

          if (activeDrag.mode === "move") {
            return {
              ...initial,
              x: initial.x + deltaX,
              y: initial.y + deltaY,
            };
          }

          if (activeDrag.mode === "scale") {
            // 中心を固定したまま、ポインターと中心の距離で直感的に拡大縮小する。
            const distance = Math.hypot(
              pointerX - activeDrag.centerX,
              pointerY - activeDrag.centerY,
            );
            const scale = clampScale(
              initial.scale * (distance / activeDrag.startDistance),
            );
            const size = visibleLayerSize({ ...initial, scale });
            return {
              ...initial,
              scale,
              x: activeDrag.centerX - size.width / 2,
              y: activeDrag.centerY - size.height / 2,
            };
          }

          if (activeDrag.mode === "rotate") {
            // 回転ハンドルの角度差を加算し、スライダーなしでも画像を回せるようにする。
            const angle = Math.atan2(
              pointerY - activeDrag.centerY,
              pointerX - activeDrag.centerX,
            );
            return {
              ...initial,
              rotation: initial.rotation + angle - activeDrag.startAngle,
            };
          }

          const side = activeDrag.cropSide;
          if (!side) return initial;
          const cos = Math.cos(initial.rotation);
          const sin = Math.sin(initial.rotation);
          const localDeltaX = cos * deltaX + sin * deltaY;
          const localDeltaY = -sin * deltaX + cos * deltaY;
          const horizontal = side === "left" || side === "right";
          const denominator =
            (horizontal ? initial.naturalWidth : initial.naturalHeight) *
            initial.scale;
          const signedDelta =
            side === "left" || side === "top"
              ? horizontal
                ? localDeltaX
                : localDeltaY
              : horizontal
                ? -localDeltaX
                : -localDeltaY;
          const oppositeSide =
            side === "left"
              ? "right"
              : side === "right"
                ? "left"
                : side === "top"
                  ? "bottom"
                  : "top";
          const cropValue = clampCrop(
            initial.crop[side] + signedDelta / Math.max(1, denominator),
            initial.crop[oppositeSide],
          );
          const crop = { ...initial.crop, [side]: cropValue };
          const cropDelta = cropValue - initial.crop[side];
          const localShiftX =
            side === "left"
              ? (cropDelta * initial.naturalWidth * initial.scale) / 2
              : side === "right"
                ? (-cropDelta * initial.naturalWidth * initial.scale) / 2
                : 0;
          const localShiftY =
            side === "top"
              ? (cropDelta * initial.naturalHeight * initial.scale) / 2
              : side === "bottom"
                ? (-cropDelta * initial.naturalHeight * initial.scale) / 2
                : 0;
          const centerX =
            activeDrag.centerX + cos * localShiftX - sin * localShiftY;
          const centerY =
            activeDrag.centerY + sin * localShiftX + cos * localShiftY;
          const size = visibleLayerSize({ ...initial, crop });

          // 回転済みレイヤーでも、動かしていない反対側の辺が画面上で止まるよう中心を補正する。
          return {
            ...initial,
            crop,
            x: centerX - size.width / 2,
            y: centerY - size.height / 2,
          };
        }),
      );
    },
    [outputWidth, outputHeight],
  );

  const handleLayerPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const activeDrag = dragStateRef.current;
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragStateRef.current = null;
      setDragState(null);
    },
    [],
  );

  const handleApply = useCallback(async () => {
    setErrorMessage(null);
    if (layers.length === 0) {
      dispatch({
        type: "set_image",
        key: "theme_ntp_background",
        value: undefined,
      });
      onClose();
      return;
    }

    try {
      setIsApplying(true);
      assertSafeCanvasSize(outputWidth, outputHeight);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(outputWidth));
      canvas.height = Math.max(1, Math.round(outputHeight));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error(t("ntpEditor.errors.canvasUnavailable"));

      const images = await Promise.all(
        layers.map((layer) =>
          ensureCachedImage(imageCacheRef.current, layer.src),
        ),
      );
      layers.forEach((layer, index) => {
        drawLayerOntoContext(ctx, layer, images[index]);
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((value) => resolve(value), "image/png", 1),
      );
      if (!blob) throw new Error(t("ntpEditor.errors.exportFailed"));
      const fileName = `ntp-background-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      await setImageWithMeta(dispatch, "theme_ntp_background", file);
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof ImageValidationError
          ? validationMessage(error)
          : error instanceof Error
            ? error.message
            : t("ntpEditor.errors.generateFailed"),
      );
    } finally {
      setIsApplying(false);
    }
  }, [
    dispatch,
    layers,
    onClose,
    outputWidth,
    outputHeight,
    t,
    validationMessage,
  ]);

  return {
    layers,
    selectedLayer,
    selectedLayerId,
    selectLayer,
    outputWidth,
    outputHeight,
    setOutputWidthValue,
    setOutputHeightValue,
    isApplying,
    errorMessage,
    canvasWrapperRef,
    canvasRef,
    handleAddFiles,
    clearLayers,
    removeLayer,
    bringForward,
    sendBackward,
    resetLayerAdjustments,
    setLayerPosition,
    setLayerScale,
    setLayerOpacity,
    setLayerRotation,
    setLayerCrop,
    toggleLayerFlip,
    handleLayerPointerDown,
    handleLayerPointerMove,
    handleLayerPointerUp,
    handleApply,
    draggingLayerId: dragState?.layerId ?? null,
  };
}
