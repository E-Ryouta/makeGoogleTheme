import type React from "react";
import { SEARCH_BOX } from "../../../../constants/ui";
// setSelectedSlot removed; no props needed
interface SearchBoxProps {}

/**
 * 検索ボックスコンポーネント
 */
export function SearchBox({}: SearchBoxProps) {
  return (
    <div
      style={{
        width: SEARCH_BOX.WIDTH,
        maxWidth: `${SEARCH_BOX.MAX_WIDTH_RATIO * 100}%`,
        height: SEARCH_BOX.HEIGHT,
        borderRadius: SEARCH_BOX.BORDER_RADIUS,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.12)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 3,
          background: "#c4cbd7",
        }}
      />
      <div style={{ color: "#1f2937", fontSize: 14 }}>
        Search Google or type a URL
      </div>
      <div
        style={{
          marginLeft: "auto",
          width: 18,
          height: 18,
          borderRadius: 3,
          background: "#c4cbd7",
        }}
      />
    </div>
  );
}
