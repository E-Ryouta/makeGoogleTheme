import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
};

export function useNtpBackgroundEditorController({
  opened,
  onClose,
  dispatch,
  current,
}: UseNtpBackgroundEditorControllerArgs) {
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

  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedLayerId) ?? null,
    [layers, selectedLayerId],
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
          setErrorMessage("画像の読み込みに失敗しました。");
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [opened, current]);

  useEffect(() => {
    if (!opened) return;
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const handlePointerUp = () => setDragState(null);
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
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(outputWidth));
        const height = Math.max(1, Math.round(outputHeight));
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
    setOutputWidth(Math.max(100, Math.round(value)));
  }, []);

  const setOutputHeightValue = useCallback((value: number) => {
    setOutputHeight(Math.max(100, Math.round(value)));
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

      for (const file of Array.from(files)) {
        try {
          const layer = await createLayerFromBlob(
            file,
            file.name,
            outputWidth,
            outputHeight,
          );
          nextLayers.push(layer);
        } catch (error) {
          console.error(error);
          setErrorMessage(`${file.name} の読み込みに失敗しました。`);
        }
      }

      if (nextLayers.length === 0) return;

      setLayers((prev) => [...prev, ...nextLayers]);
      setSelectedLayerId(nextLayers[nextLayers.length - 1]?.id ?? null);
    },
    [outputWidth, outputHeight],
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
    (layerId: string) => (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      setSelectedLayerId(layerId);
      const wrapper = canvasWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const layer = layers.find((item) => item.id === layerId);
      if (!layer) return;

      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragState({
        layerId,
        pointerId: event.pointerId,
        startX: pointerX,
        startY: pointerY,
        initialX: layer.x,
        initialY: layer.y,
      });
    },
    [layers],
  );

  const handleLayerPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      const wrapper = canvasWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      if (outputWidth === 0 || outputHeight === 0) return;
      const scaleX = rect.width / outputWidth;
      const scaleY = rect.height / outputHeight;
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const deltaX = (pointerX - dragState.startX) / scaleX;
      const deltaY = (pointerY - dragState.startY) / scaleY;

      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === dragState.layerId
            ? {
                ...layer,
                x: dragState.initialX + deltaX,
                y: dragState.initialY + deltaY,
              }
            : layer,
        ),
      );
    },
    [dragState, outputWidth, outputHeight],
  );

  const handleLayerPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      setDragState(null);
    },
    [dragState],
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
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(outputWidth));
      canvas.height = Math.max(1, Math.round(outputHeight));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("キャンバスが利用できません");

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
      if (!blob) throw new Error("画像の書き出しに失敗しました");
      const fileName = `ntp-background-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      setImageWithMeta(dispatch, "theme_ntp_background", file);
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "画像の生成に失敗しました",
      );
    } finally {
      setIsApplying(false);
    }
  }, [dispatch, layers, onClose, outputWidth, outputHeight]);

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
