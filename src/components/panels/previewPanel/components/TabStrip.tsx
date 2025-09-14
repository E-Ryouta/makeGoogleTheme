import type React from "react";
import { METRICS, TAB } from "../../../../constants/ui";
import { PreviewComponentProps, ColorProps, ImageProps } from "./types";
import { Tab } from "./Tab";

interface TabStripProps extends PreviewComponentProps, ColorProps, ImageProps {}

/**
 * タブストリップコンポーネント
 */
export function TabStrip({
  setSelectedSlot,
  frameColor,
  toolbarColor,
  toolbarTextColor,
  tabBgUrl,
}: TabStripProps) {
  const tabs = [
    { text: "New Tab", isActive: true },
    { text: "Docs", isActive: false, backgroundOffset: TAB.WIDTH + 18 },
    { text: "Mail", isActive: false, backgroundOffset: TAB.WIDTH * 2 + 22 },
    { text: "Work", isActive: false, backgroundOffset: TAB.WIDTH * 3 + 26 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height: METRICS.tabStrip,
        position: "relative",
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          {...tab}
          toolbarColor={toolbarColor}
          frameColor={frameColor}
          toolbarTextColor={toolbarTextColor}
          tabBgUrl={tabBgUrl}
        />
      ))}
      <div style={{ flex: 1 }} />
    </div>
  );
}
