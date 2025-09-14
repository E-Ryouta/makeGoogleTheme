import type React from "react";
import { TAB } from "../../../../constants/ui";
import type { TabData } from "../../../../types/types";

type TabProps = TabData & {
  /** ツールバーの色 */
  toolbarColor: string;
  /** フレームの色 */
  frameColor: string;
  /** ツールバーテキストの色 */
  toolbarTextColor: string;
  /** タブ背景画像のURL */
  tabBgUrl?: string;
  /** アクティブ時の背景画像のURL */
  toolbarBgUrl?: string;
};

/**
 * 個別のタブコンポーネント
 */
export function Tab({
  text,
  isActive,
  backgroundOffset,
  toolbarColor,
  frameColor,
  toolbarTextColor,
  tabBgUrl,
  toolbarBgUrl,
}: TabProps) {
  const baseStyle: React.CSSProperties = {
    padding: "8px 16px",
    minWidth: TAB.WIDTH,
    cursor: "default",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    background: toolbarColor || frameColor || "#fff",
    backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
    backgroundPosition: `left -12px top -20px`,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    boxShadow: "0 -1px 0 rgba(0,0,0,0.12) inset",
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    borderRadius: 10,
    color: "#65768a",
    backgroundImage: tabBgUrl ? `url(${tabBgUrl})` : undefined,
    backgroundRepeat: "repeat-x",
    backgroundPosition: backgroundOffset
      ? `left -${backgroundOffset}px top -20px`
      : undefined,
  };

  const iconStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: 2,
    background: isActive ? "#e2e2e2" : "rgba(255,255,255,0.5)",
  };

  return (
    <div style={isActive ? activeStyle : inactiveStyle}>
      <div style={iconStyle} />
      <div
        style={{
          color: isActive ? toolbarTextColor || "#444" : toolbarTextColor,
          fontSize: 13,
        }}
      >
        {text}
      </div>
    </div>
  );
}
