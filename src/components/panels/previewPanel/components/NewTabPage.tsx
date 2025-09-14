import type React from "react";
import { ColorProps } from "../../../../types/types";
import { SearchBox } from "./SearchBox";
import { Shortcuts } from "./Shortcuts";

type NewTabPageProps = Pick<ColorProps, "ntpTextColor"> & {
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
};

/**
 * 新規タブページコンポーネント
 */
export function NewTabPage({
  ntpTextColor,
  ntpHeight,
  searchTop,
  shortcutsTop,
  ntpStyle,
}: NewTabPageProps) {
  return (
    <div
      style={{
        height: ntpHeight,
        position: "relative",
        padding: 24,
        ...ntpStyle,
      }}
    >
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
        <SearchBox />
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
        <Shortcuts ntpTextColor={ntpTextColor} />
      </div>
    </div>
  );
}
