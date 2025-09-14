import type React from "react";
import { METRICS, ICON } from "../../../../constants/ui";
import { ColorProps, ImageProps } from "./types";

interface ToolbarProps extends ColorProps, ImageProps {
  /** ツールバーアイコンのCSS */
  toolbarIconCss: string;
}

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
    borderRadius: ICON.BORDER_RADIUS,
    background: toolbarIconCss,
    opacity: 1,
  });

  return (
    <div
      style={{
        height: METRICS.toolbar,
        marginTop: -1,
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
      <div
        title="Buttons"
        style={{ display: "flex", gap: 6 }}
      >
        <div className="pc-icon" style={{ ...icon(ICON.TOOLBAR_SIZE) }} />
        <div className="pc-icon" style={{ ...icon(ICON.TOOLBAR_SIZE) }} />
        <div className="pc-icon" style={{ ...icon(ICON.TOOLBAR_SIZE) }} />
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
            width: 16,
            height: 16,
            borderRadius: 2,
            background: "#c4cbd7",
          }}
        />
        <div
          style={{ color: omniboxTextColor, fontSize: 13 }}
        >
          Search Google or type a URL
        </div>
      </div>

      {/* 右側のアイコン */}
      <div style={{ display: "flex", gap: 8 }}>
        <div className="pc-icon" style={{ ...icon() }} />
        <div className="pc-icon" style={{ ...icon() }} />
        <div className="pc-icon" style={{ ...icon() }} />
      </div>
    </div>
  );
}
