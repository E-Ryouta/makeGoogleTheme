import { METRICS } from "../../../../constants/ui";
import { Grid2x2, Folder } from "lucide-react";
import type { ColorProps, ImageProps } from "../../../../types/types";

type BookmarksBarProps = Pick<
  ColorProps,
  "toolbarColor" | "bookmarkTextColor"
> &
  Pick<ImageProps, "toolbarBgUrl">;

/**
 * ブックマークバーコンポーネント
 */
export function BookmarksBar({
  toolbarColor,
  bookmarkTextColor,
  toolbarBgUrl,
}: BookmarksBarProps) {
  const bookmarks = ["Gmail", "Images", "Work", "Docs"];

  return (
    <div
      style={{
        height: METRICS.bookmarks,
        position: "relative",
        top: -2,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        justifyContent: "space-between",
        backgroundColor: toolbarColor,
        backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
        backgroundPosition: `left 0px top -100px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Grid2x2
          style={{
            color: "#7d7d7d",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: bookmarkTextColor || "#2f3b46",
          }}
        >
          {bookmarks.map((bookmark, _) => (
            <span key={bookmark} className="pc-bookmark">
              {bookmark}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          gap: 6,
          display: "flex",
          color: bookmarkTextColor || "#2f3b46",
        }}
      >
        <Folder />
        すべてのブックマーク
      </div>
    </div>
  );
}
