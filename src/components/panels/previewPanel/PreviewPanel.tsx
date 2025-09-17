import { Box } from "@mantine/core";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CANVAS, METRICS, NTP } from "../../../constants/ui";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useThemeImages } from "../../../hooks/useThemeImages";
import { useTheme } from "../../../store/themeStore";
import { BookmarksBar } from "./components/BookmarksBar";
import { NewTabPage } from "./components/NewTabPage";
import { TabStrip } from "./components/TabStrip";
import { Toolbar } from "./components/Toolbar";

export default function PreviewPanel() {
  const { state } = useTheme();
  const colors = useThemeColors();
  const { frameBgUrl, toolbarBgUrl, tabBgUrl, ntpBgUrl } = useThemeImages();

  const ntpStyle: React.CSSProperties = {
    backgroundImage: ntpBgUrl ? `url(${ntpBgUrl})` : undefined,
    // 実機では画像は実寸で配置される（スケールなし）。
    backgroundSize: "auto",
    backgroundPosition: (() => {
      const a = state.properties.ntp_background_alignment;
      if (!a) return "center center";
      const allowed = new Set([
        "left",
        "right",
        "top",
        "bottom",
        "center",
        "left top",
        "left center",
        "left bottom",
        "center top",
        "center center",
        "center bottom",
        "right top",
        "right center",
        "right bottom",
      ]);
      if (allowed.has(a)) {
        if (a === "left") return "left center";
        if (a === "right") return "right center";
        if (a === "top") return "center top";
        if (a === "bottom") return "center 100%"; // avoid sub-pixel cropping at bottom
        if (a === "center") return "center center";
        // Adjust any "* bottom" to compensate for transform scale rounding
        if (a.endsWith(" bottom")) {
          const x = a.split(" ")[0] as "left" | "center" | "right";
          return `${x} 100%`;
        }
        return a;
      }
      return "center center";
    })(),
    backgroundRepeat: state.properties.ntp_background_repeat || "no-repeat",
    // 画像があっても余白は背景色で塗る（実機同様）
    backgroundColor: colors.ntpBackground || "#ffffff",
    borderRadius: (() => {
      // 右下の場合は右下にradiusを、左下の場合は左下にradiusを設定する
      const a = state.properties.ntp_background_alignment;
      if (a === "right bottom") {
        return "0 0 10px 0";
      } else if (a === "left bottom") {
        return "0 0 0 10px";
      }

      return "0 0 0 0";
    })(),
  };

  const buttonBg = colors.buttonBackground;
  const toolbarIconColor = colors.toolbarButtonIcon;
  // Toolbar icons prefer toolbar_button_icon → fallback gray
  const toolbarIconCss = toolbarIconColor || "";
  // Window caption buttons prefer button_background, fallback to toolbarIconCss
  const windowButtonCss = buttonBg ? colors.buttonBackground : toolbarIconCss;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || CANVAS.BASE_WIDTH;
      setScale(w / CANVAS.BASE_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 新規タブページの高さを計算
  const ntpHeight = Math.max(
    NTP.MIN_HEIGHT,
    CANVAS.BASE_HEIGHT -
      (METRICS.tabStrip + METRICS.toolbar + METRICS.bookmarks),
  );
  const searchTop = Math.round(ntpHeight * NTP.SEARCH_TOP_RATIO);
  const shortcutsTop = searchTop + NTP.SHORTCUTS_OFFSET;

  return (
    <Box ref={containerRef} h={"calc(100vh - 140px)"}>
      {/* Mode control removed */}
      <div
        style={{
          width: CANVAS.BASE_WIDTH,
          height: CANVAS.BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid",
        }}
      >
        {/* Frame (tab strip removed) */}
        <div
          style={{
            background: colors.frame || "#e5e9f6",
            backgroundImage: frameBgUrl ? `url(${frameBgUrl})` : undefined,
            backgroundPosition: "left top",
            backgroundOrigin: "border-box",
            backgroundRepeat: "repeat-x",
            padding: "0 0 0 14px",
            userSelect: "none",
          }}
        >
          <TabStrip
            frameColor={colors.frame}
            toolbarColor={colors.toolbar}
            toolbarTextColor={colors.toolbarText}
            tabBgUrl={tabBgUrl}
            toolbarBgUrl={toolbarBgUrl}
            windowButtonCss={windowButtonCss}
          />
        </div>

        <Toolbar
          toolbarColor={colors.toolbar}
          toolbarTextColor={colors.toolbarText}
          toolbarBgUrl={toolbarBgUrl}
          omniboxBackgroundColor={colors.omniboxBackground}
          omniboxTextColor={colors.omniboxText}
          toolbarIconCss={toolbarIconCss}
        />

        <BookmarksBar
          toolbarColor={colors.toolbar}
          bookmarkTextColor={colors.bookmarkText}
          toolbarBgUrl={toolbarBgUrl}
        />

        <NewTabPage
          ntpTextColor={colors.ntpText}
          ntpHeight={ntpHeight}
          searchTop={searchTop}
          shortcutsTop={shortcutsTop}
          ntpStyle={ntpStyle}
          toolbarIconCss={toolbarIconCss}
        />
      </div>
    </Box>
  );
}
