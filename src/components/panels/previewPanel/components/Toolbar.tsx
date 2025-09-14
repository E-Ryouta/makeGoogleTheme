import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Download,
  RotateCw,
} from "lucide-react";
import { ICON, METRICS } from "../../../../constants/ui";
import type { ColorProps, ImageProps } from "../../../../types/types";

type ToolbarProps = Pick<
  ColorProps,
  | "toolbarColor"
  | "toolbarTextColor"
  | "omniboxBackgroundColor"
  | "omniboxTextColor"
> &
  Pick<ImageProps, "toolbarBgUrl"> & {
    /** ツールバーアイコンのCSS */
    toolbarIconCss: string;
  };

/**
 * ツールバーコンポーネント
 */
export function Toolbar({
  toolbarColor,
  toolbarTextColor,
  toolbarBgUrl,
  omniboxBackgroundColor,
  omniboxTextColor,
  toolbarIconCss,
}: ToolbarProps) {
  const icon = (w: number = ICON.DEFAULT_SIZE) => ({
    width: w,
    height: w,
    color: toolbarIconCss,
  });

  return (
    <div
      style={{
        height: METRICS.toolbar,
        marginTop: -2,
        background: toolbarColor || "#f0f3fa",
        backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
        backgroundPosition: `left 0px top -55px`,
        backgroundOrigin: "border-box",
        backgroundRepeat: "repeat-x",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 12px",
        color: toolbarTextColor,
        position: "relative",
      }}
    >
      {/* ナビゲーションボタン */}
      <div title="Buttons" style={{ display: "flex", gap: 6 }}>
        <ArrowLeft style={{ ...icon() }} />
        <ArrowRight style={{ ...icon() }} />
        <RotateCw style={{ ...icon() }} />
      </div>

      {/* オムニボックス */}
      <div
        style={{
          height: 32,
          borderRadius: 16,
          background: omniboxBackgroundColor,
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 90,
            background: "#c4cbd7",
          }}
        />
        <div style={{ color: omniboxTextColor, fontSize: 13 }}>
          プレースフォルダー
        </div>
      </div>

      {/* 右側のアイコン */}
      <div style={{ display: "flex", gap: 8 }}>
        <Download style={{ ...icon() }} />
        <div
          className="pc-icon"
          style={{ ...icon(), borderRadius: 90, background: "#7d7d7d" }}
        />
        <Ellipsis style={{ ...icon(), transform: "rotate(90deg)" }} />
      </div>
    </div>
  );
}
