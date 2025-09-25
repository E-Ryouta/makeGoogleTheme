import { SHORTCUT } from "../../../../constants/ui";
import { useTranslation } from "react-i18next";
import type { ColorProps } from "../../../../types/types";

type ShortcutsProps = Pick<ColorProps, "ntpTextColor">;

/**
 * ショートカットコンポーネント
 */
export function Shortcuts({ ntpTextColor }: ShortcutsProps) {
  const { t } = useTranslation();
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
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
            className="pc-ntp-link"
            style={{
              color: ntpTextColor || "#1a73e8",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {t("preview.shortcuts.label")}
          </div>
        </div>
      ))}
    </div>
  );
}
