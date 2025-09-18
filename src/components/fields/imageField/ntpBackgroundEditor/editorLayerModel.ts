export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;

export type LayerCropSide = "left" | "right" | "top" | "bottom";

export type FlipAxis = "horizontal" | "vertical";

export type EditorLayer = {
  id: string;
  name: string;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  rotation: number; // radians
  crop: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
};
