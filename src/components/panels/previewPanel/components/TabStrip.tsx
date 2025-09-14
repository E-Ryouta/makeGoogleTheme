import { METRICS, TAB } from "../../../../constants/ui";
import type { ColorProps, ImageProps } from "../../../../types/types";
import { Tab } from "./Tab";

// type TabStripProps = ColorProps & ImageProps;

type TabStripProps = Pick<
  ColorProps,
  "frameColor" | "toolbarColor" | "toolbarTextColor"
> &
  Pick<ImageProps, "tabBgUrl" | "toolbarBgUrl">;

/**
 * タブストリップコンポーネント
 */
export function TabStrip({
  frameColor,
  toolbarColor,
  toolbarTextColor,
  tabBgUrl,
  toolbarBgUrl,
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
      {tabs.map((tab, _) => (
        <Tab
          key={tab.text}
          {...tab}
          toolbarColor={toolbarColor}
          frameColor={frameColor}
          toolbarTextColor={toolbarTextColor}
          tabBgUrl={tabBgUrl}
          toolbarBgUrl={toolbarBgUrl}
        />
      ))}
      <div style={{ flex: 1 }} />
    </div>
  );
}
