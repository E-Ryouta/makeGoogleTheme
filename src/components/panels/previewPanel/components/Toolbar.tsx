import {
  ArrowLeft,
  ArrowRight,
  Download,
  Ellipsis,
  Info,
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

  // Determine default omnibox state and apply transparency only to the background color
  const isDefaultOmniboxBg = (() => {
    const v = (omniboxBackgroundColor || "").toLowerCase();
    return v === "" || v === "#fff" || v === "#ffffff" || v === "white";
  })();
  const omniboxBg = isDefaultOmniboxBg
    ? "rgba(255,255,255,0.5)"
    : omniboxBackgroundColor;

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
          background: omniboxBg,
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
        }}
      >
        <div
          style={{
            width: 25,
            height: 25,
            borderRadius: 100,
            background: toolbarColor,
            textAlign: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Info
              style={{
                width: 15,
                height: 15,
              }}
            />
          </div>
        </div>
        <div style={{ color: omniboxTextColor, fontSize: 13 }}>URL</div>
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
