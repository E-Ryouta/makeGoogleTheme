import type React from "react";
import { ICON } from "../../../../constants/ui";
import { PreviewComponentProps, ColorProps, ImageProps } from "./types";
import { SearchBox } from "./SearchBox";
import { Shortcuts } from "./Shortcuts";

interface NewTabPageProps
  extends PreviewComponentProps,
    ColorProps,
    ImageProps {
  /** NTPの高さ */
  ntpHeight: number;
  /** 検索ボックスの上端位置 */
  searchTop: number;
  /** ショートカットの上端位置 */
  shortcutsTop: number;
  /** NTPのスタイル */
  ntpStyle: React.CSSProperties;
  /** ツールバーアイコンのCSS */
  toolbarIconCss: string;
}

/**
 * 新規タブページコンポーネント
 */
export function NewTabPage({
  setSelectedSlot,
  ntpBackgroundColor,
  ntpTextColor,
  ntpLinkColor,
  ntpBgUrl,
  ntpHeight,
  searchTop,
  shortcutsTop,
  ntpStyle,
  toolbarIconCss,
}: NewTabPageProps) {
  const quickLinks = [
    { text: "Gmail", slot: "ntp_link" },
    { text: "画像", slot: "ntp_link" },
  ];

  return (
    <div
      onClick={() => setSelectedSlot("ntp_background")}
      style={{
        height: ntpHeight,
        position: "relative",
        padding: 24,
        ...ntpStyle,
        cursor: "pointer",
      }}
    >
      {/* NTP右上のクイックリンク */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 12,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="pc-ntp-link"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot(link.slot);
            }}
            style={{
              color: ntpLinkColor || "#1a73e8",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {link.text}
          </div>
        ))}
        <div
          className="pc-icon"
          title="Apps"
          style={{
            width: ICON.DEFAULT_SIZE,
            height: ICON.DEFAULT_SIZE,
            borderRadius: 6,
            background: toolbarIconCss,
          }}
        />
        <div
          className="pc-icon"
          title="Profile"
          style={{
            width: ICON.PROFILE_SIZE,
            height: ICON.PROFILE_SIZE,
            borderRadius: ICON.PROFILE_BORDER_RADIUS,
            background: toolbarIconCss,
          }}
        />
      </div>

      {/* 中央の検索ボックス */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: searchTop,
          display: "grid",
          placeItems: "center",
        }}
      >
        <SearchBox setSelectedSlot={setSelectedSlot} />
      </div>

      {/* ショートカット行 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: shortcutsTop,
        }}
      >
        <Shortcuts
          setSelectedSlot={setSelectedSlot}
          ntpTextColor={ntpTextColor}
        />
      </div>
    </div>
  );
}
