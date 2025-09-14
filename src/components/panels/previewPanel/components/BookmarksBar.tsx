import type React from "react";
import { METRICS } from "../../../../constants/ui";
import { PreviewComponentProps, ColorProps, ImageProps } from "./types";

interface BookmarksBarProps
  extends PreviewComponentProps,
    ColorProps,
    ImageProps {}

/**
 * ブックマークバーコンポーネント
 */
export function BookmarksBar({
  setSelectedSlot,
  toolbarColor,
  bookmarkTextColor,
  toolbarBgUrl,
}: BookmarksBarProps) {
  const bookmarks = ["Gmail", "Images", "Work", "Docs"];

  return (
    <div
      onClick={() => setSelectedSlot("bookmark_text")}
      style={{
        height: METRICS.bookmarks,
        marginTop: -1,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 14px",
        color: bookmarkTextColor || "#2f3b46",
        backgroundColor: toolbarColor,
        backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
        backgroundPosition: `left 0px top -100px`,
        cursor: "pointer",
      }}
    >
      {bookmarks.map((bookmark, index) => (
        <span key={index} className="pc-bookmark">
          {bookmark}
        </span>
      ))}
    </div>
  );
}
