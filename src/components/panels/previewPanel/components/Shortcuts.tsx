import type React from "react";
import { SHORTCUT } from "../../../../constants/ui";
import { PreviewComponentProps, ColorProps } from "./types";

interface ShortcutsProps extends PreviewComponentProps, ColorProps {}

/**
 * ショートカットコンポーネント
 */
export function Shortcuts({ setSelectedSlot, ntpTextColor }: ShortcutsProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: SHORTCUT.COUNT }).map((_, i) => (
        <div
          key={i}
          style={{
            width: SHORTCUT.WIDTH,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: SHORTCUT.ICON_SIZE,
              height: SHORTCUT.ICON_SIZE,
              borderRadius: SHORTCUT.ICON_BORDER_RADIUS,
              background: "#cdd6e5",
            }}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot("ntp_link");
            }}
            className="pc-ntp-link"
            style={{
              color: ntpTextColor || "#1a73e8",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Shortcut
          </div>
        </div>
      ))}
    </div>
  );
}
