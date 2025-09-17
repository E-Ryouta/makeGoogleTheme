import { colorToCss } from "../../../../lib/color";
import type { RGB, RGBA } from "../../../../types/theme";

type WindowControlsProps = {
  /** ウィンドウボタンの背景色 */
  buttonColor: string | RGB | RGBA;
};

/**
 * ウィンドウのコントロールボタン（最小化、最大化、閉じる）
 */
export function WindowControls({ buttonColor }: WindowControlsProps) {
  const buttons = [
    { symbol: "ー", title: "Minimize" },
    { symbol: "▢", title: "Maximize" },
    { symbol: "✕", title: "Close" },
  ];

  const buttonColorPrev = buttonColor ? buttonColor : "";

  const backgroundCss = Array.isArray(buttonColorPrev)
    ? colorToCss(buttonColorPrev)
    : buttonColorPrev;

  return (
    <div
      style={{
        right: -2,
        display: "flex",
      }}
    >
      {buttons.map((button) => (
        <div
          key={button.title}
          title={button.title}
          className="pc-winbtn"
          style={{
            width: 55,
            height: 55,
            background: backgroundCss,
            display: "grid",
            placeItems: "center",
            color: "#696969",
            fontSize: 20,
            opacity: 0.9,
          }}
        >
          {button.symbol}
        </div>
      ))}
    </div>
  );
}
