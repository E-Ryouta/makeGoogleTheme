import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEARCH_BOX } from "../../../../constants/ui";

/**
 * 検索ボックスコンポーネント
 */
export function SearchBox() {
  const { t } = useTranslation();
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
      <Search
        style={{
          width: 18,
          height: 18,
          color: "#c4cbd7",
        }}
      />
      <div style={{ color: "#1f2937", fontSize: 14 }}>
        {t("preview.searchBox.placeholder")}
      </div>
    </div>
  );
}
