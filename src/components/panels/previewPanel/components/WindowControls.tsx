import type React from "react";
import { PreviewComponentProps } from "./types";

interface WindowControlsProps extends PreviewComponentProps {
  /** ウィンドウボタンの背景色 */
  buttonColor: string;
}

/**
 * ウィンドウのコントロールボタン（最小化、最大化、閉じる）
 */
export function WindowControls({
  setSelectedSlot,
  buttonColor,
}: WindowControlsProps) {
  const buttons = [
    { symbol: "ー", title: "Minimize" },
    { symbol: "▢", title: "Maximize" },
    { symbol: "✕", title: "Close" },
  ];

  return (
    <div style={{ position: "relative", height: 0 }}>
      <div
        style={{
          position: "absolute",
          right: -2,
          display: "flex",
        }}
      >
        {buttons.map((button, i) => (
          <div
            key={i}
            title={button.title}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot("buttons_tint");
            }}
            className="pc-winbtn"
            style={{
              width: 55,
              height: 55,
              background: buttonColor,
              display: "grid",
              placeItems: "center",
              color: "black",
              fontSize: 20,
              opacity: 0.9,
              cursor: "pointer",
            }}
          >
            {button.symbol}
          </div>
        ))}
      </div>
    </div>
  );
}
