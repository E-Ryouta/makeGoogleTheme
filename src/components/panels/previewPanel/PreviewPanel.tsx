import { Box } from "@mantine/core";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelectedSlot } from "../../../store/themeStore";
import { colorToCss, rgbToHex } from "../../../lib/color";
import { useTheme } from "../../../store/themeStore";

export default function PreviewPanel() {
  const { state } = useTheme();
  const { selectedSlot, setSelectedSlot } = useSelectedSlot();

  const frameColor = useMemo(() => {
    const c = state.colors.frame;
    return (
      colorToCss(c) || rgbToHex(c ? ([c[0], c[1], c[2]] as any) : undefined)
    );
  }, [state.colors]);

  const toolbarColor =
    colorToCss(state.colors.toolbar) ||
    rgbToHex(
      state.colors.toolbar
        ? ([
            state.colors.toolbar[0],
            state.colors.toolbar[1],
            state.colors.toolbar[2],
          ] as any)
        : undefined,
    );

  // Tabs removed
  const bookmarkTextColor =
    colorToCss(state.colors.bookmark_text) ||
    rgbToHex(
      state.colors.bookmark_text
        ? ([
            state.colors.bookmark_text[0],
            state.colors.bookmark_text[1],
            state.colors.bookmark_text[2],
          ] as any)
        : undefined,
    );
  const ntpBgColor = colorToCss((state.colors as any).ntp_background);
  const ntpTextColor =
    colorToCss(state.colors.ntp_text) ||
    rgbToHex(
      state.colors.ntp_text
        ? ([
            state.colors.ntp_text[0],
            state.colors.ntp_text[1],
            state.colors.ntp_text[2],
          ] as any)
        : undefined,
    );
  const ntpLinkColor =
    colorToCss(state.colors.ntp_link) ||
    rgbToHex(
      state.colors.ntp_link
        ? ([
            state.colors.ntp_link[0],
            state.colors.ntp_link[1],
            state.colors.ntp_link[2],
          ] as any)
        : undefined,
    );
  const omniboxBgColor =
    colorToCss((state.colors as any).omnibox_background) || "#fff";
  const omniboxTextColor =
    colorToCss((state.colors as any).omnibox_text) || "#6b7280";
  const toolbarTextColor =
    colorToCss((state.colors as any).toolbar_text) || "#333";

  const frameBgUrl = useMemo(() => {
    const f = state.images.theme_frame;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_frame]);

  // Frame overlay removed

  const toolbarBgUrl = useMemo(() => {
    const f = state.images.theme_toolbar;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_toolbar]);

  // Tab background image (for inactive tabs and new-tab button)
  const tabBgUrl = useMemo(() => {
    const f = (state.images as any).theme_tab_background as
      | { blob: Blob }
      | undefined;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [(state.images as any).theme_tab_background]);

  const ntpBgUrl = useMemo(() => {
    const f = state.images.theme_ntp_background;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_ntp_background]);

  const prevUrl = useRef<{
    frame?: string;
    toolbar?: string;
    tab?: string;
    ntp?: string;
  }>({});
  useEffect(() => {
    if (prevUrl.current.ntp && prevUrl.current.ntp !== ntpBgUrl)
      URL.revokeObjectURL(prevUrl.current.ntp);
    prevUrl.current.ntp = ntpBgUrl;
    return () => {
      if (prevUrl.current.ntp) URL.revokeObjectURL(prevUrl.current.ntp);
    };
  }, [ntpBgUrl]);

  useEffect(() => {
    if (prevUrl.current.frame && prevUrl.current.frame !== frameBgUrl)
      URL.revokeObjectURL(prevUrl.current.frame);
    prevUrl.current.frame = frameBgUrl;
    return () => {
      if (prevUrl.current.frame) URL.revokeObjectURL(prevUrl.current.frame);
    };
  }, [frameBgUrl]);

  // Frame overlay URL management removed

  useEffect(() => {
    if (prevUrl.current.toolbar && prevUrl.current.toolbar !== toolbarBgUrl)
      URL.revokeObjectURL(prevUrl.current.toolbar);
    prevUrl.current.toolbar = toolbarBgUrl;
    return () => {
      if (prevUrl.current.toolbar) URL.revokeObjectURL(prevUrl.current.toolbar);
    };
  }, [toolbarBgUrl]);

  useEffect(() => {
    if (prevUrl.current.tab && prevUrl.current.tab !== tabBgUrl)
      URL.revokeObjectURL(prevUrl.current.tab);
    prevUrl.current.tab = tabBgUrl || undefined;
    return () => {
      if (prevUrl.current.tab) URL.revokeObjectURL(prevUrl.current.tab);
    };
  }, [tabBgUrl]);

  const ntpStyle: React.CSSProperties = {
    backgroundImage: ntpBgUrl ? `url(${ntpBgUrl})` : undefined,
    // 実機では画像は実寸で配置される（スケールなし）。
    backgroundSize: "auto",
    backgroundPosition: (() => {
      const a = state.properties.ntp_background_alignment;
      if (!a) return "center center";
      const allowed = new Set([
        "left",
        "right",
        "top",
        "bottom",
        "center",
        "left top",
        "left center",
        "left bottom",
        "center top",
        "center center",
        "center bottom",
        "right top",
        "right center",
        "right bottom",
      ]);
      if (allowed.has(a)) {
        if (a === "left") return "left center";
        if (a === "right") return "right center";
        if (a === "top") return "center top";
        if (a === "bottom") return "center 100%"; // avoid sub-pixel cropping at bottom
        if (a === "center") return "center center";
        // Adjust any "* bottom" to compensate for transform scale rounding
        if (a.endsWith(" bottom")) {
          const x = a.split(" ")[0] as "left" | "center" | "right";
          return `${x} 100%`;
        }
        return a;
      }
      return "center center";
    })(),
    backgroundRepeat: state.properties.ntp_background_repeat || "no-repeat",
    // 画像があっても余白は背景色で塗る（実機同様）
    backgroundColor: ntpBgColor || "#ffffff",
    borderRadius: (() => {
      // 右下の場合は右下にradiusを、左下の場合は左下にradiusを設定する
      const a = state.properties.ntp_background_alignment;
      if (a === "right bottom") {
        return "0 0 10px 0";
      } else if (a === "left bottom") {
        return "0 0 0 10px";
      }

      return "0 0 0 0";
    })(),
  };

  // Selection outline removed
  const slotOutline = (_slot: string) => ({});

  const buttonsTint = state.tints.buttons;
  const buttonBg = (state.colors as any).button_background as any;
  const toolbarIconColor = colorToCss(
    (state.colors as any).toolbar_button_icon,
  );
  // Toolbar icons prefer toolbar_button_icon → tints.buttons → fallback gray
  const toolbarIconCss = toolbarIconColor
    ? toolbarIconColor
    : buttonsTint
      ? `hsl(${Math.round((buttonsTint[0] || 0) * 360)}, ${Math.round((buttonsTint[1] || 0) * 100)}%, ${Math.round((buttonsTint[2] || 0) * 100)}%)`
      : "rgba(0,0,0,0.5)";
  // Window caption buttons prefer button_background, fallback to toolbarIconCss
  const windowButtonCss = buttonBg ? colorToCss(buttonBg) : toolbarIconCss;
  const icon = (w = 22) => ({
    width: w,
    height: w,
    borderRadius: 4,
    background: toolbarIconCss,
    opacity: 1,
  });

  // Base canvas size targets 1920x1080 and scales down to fit its parent.
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || BASE_WIDTH;
      setScale(w / BASE_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // More Chrome‑like vertical metrics (Windows, 100% scaling, approx).
  const METRICS = {
    tabStrip: 50,
    toolbar: 44,
    bookmarks: 40,
  } as const;
  // Base width used for tab background offsetting
  const TAB_WIDTH = 260;
  const NTP_HEIGHT = Math.max(
    360,
    BASE_HEIGHT - (METRICS.tabStrip + METRICS.toolbar + METRICS.bookmarks),
  );
  const SEARCH_TOP = Math.round(NTP_HEIGHT * 0.2); // ~20% from top of NTP
  const SHORTCUTS_TOP = SEARCH_TOP + 120;

  return (
    <Box ref={containerRef} h={"calc(100vh - 140px)"}>
      {/* Mode control removed */}
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid",
        }}
      >
        <style>{`
        .pc-icon, .pc-winbtn {
          transition: filter .12s ease, opacity .12s ease, background-color .12s ease;
        }
        .pc-icon:hover, .pc-winbtn:hover {
          filter: brightness(1.18);
        }
        /* Tabs removed */
        .pc-bookmark, .pc-ntp-link {
          transition: filter .12s ease, color .12s ease;
        }
        .pc-bookmark:hover, .pc-ntp-link:hover {
          filter: brightness(1.15);
        }
      `}</style>
        {/* Frame (tab strip removed) */}
        <div
          style={{
            background: frameColor || "#e5e9f6",
            backgroundImage: frameBgUrl ? `url(${frameBgUrl})` : undefined,
            backgroundPosition: "left top",
            backgroundOrigin: "border-box",
            backgroundRepeat: "repeat-x",
            padding: "0 0 0 14px",
            userSelect: "none",
          }}
          onClick={() => setSelectedSlot("frame")}
        >
          {/* Window controls (top-right) */}
          <div style={{ position: "relative", height: 0 }}>
            <div
              style={{
                position: "absolute",
                right: -2,
                display: "flex",
              }}
            >
              {["ー", "▢", "✕"].map((s, i) => (
                <div
                  key={i}
                  title={i === 0 ? "Minimize" : i === 1 ? "Maximize" : "Close"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSlot("buttons_tint");
                  }}
                  className="pc-winbtn"
                  style={{
                    width: 55,
                    height: 55,
                    background: windowButtonCss,
                    display: "grid",
                    placeItems: "center",
                    color: "black",
                    fontSize: 20,
                    opacity: 0.9,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 4,
              height: METRICS.tabStrip,
              position: "relative",
              ...slotOutline("frame"),
            }}
          >
            {/* Active tab */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                background: toolbarColor || frameColor || "#fff",
                backgroundImage: toolbarBgUrl
                  ? `url(${toolbarBgUrl})`
                  : undefined,
                backgroundPosition: `left -12px top -20px`,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: "8px 16px",
                minWidth: TAB_WIDTH,
                boxShadow: "0 -1px 0 rgba(0,0,0,0.12) inset",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    background: "#e2e2e2",
                  }}
                />
                <div
                  style={{ color: toolbarTextColor || "#444", fontSize: 13 }}
                >
                  New Tab
                </div>
              </div>
            </div>

            {/* Inactive tab 1 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                borderRadius: 10,
                padding: "8px 16px",
                minWidth: TAB_WIDTH,
                cursor: "default",
                color: "#65768a",
                backgroundImage: tabBgUrl ? `url(${tabBgUrl})` : undefined,
                backgroundRepeat: "repeat-x",
                backgroundPosition: `left -${TAB_WIDTH + 18}px top -20px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.5)",
                  }}
                />
                <div style={{ color: toolbarTextColor, fontSize: 13 }}>
                  Docs
                </div>
              </div>
            </div>

            {/* Inactive tab 2 (offset by 1 tab) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                borderRadius: 10,
                padding: "8px 16px",
                minWidth: TAB_WIDTH,
                cursor: "default",
                color: "#65768a",
                backgroundImage: tabBgUrl ? `url(${tabBgUrl})` : undefined,
                backgroundRepeat: "repeat-x",
                backgroundPosition: `left -${TAB_WIDTH * 2 + 22}px top -20px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.5)",
                  }}
                />
                <div style={{ color: toolbarTextColor, fontSize: 13 }}>
                  Mail
                </div>
              </div>
            </div>

            {/* Inactive tab 3 (offset by 2 tabs) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                borderRadius: 10,
                padding: "8px 16px",
                minWidth: TAB_WIDTH,
                cursor: "default",
                color: "#65768a",
                backgroundImage: tabBgUrl ? `url(${tabBgUrl})` : undefined,
                backgroundRepeat: "repeat-x",
                backgroundPosition: `left -${TAB_WIDTH * 3 + 26}px top -20px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.5)",
                  }}
                />
                <div style={{ color: toolbarTextColor, fontSize: 13 }}>
                  Work
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />
          </div>
        </div>

        {/* Toolbar */}
        <div
          onClick={() => setSelectedSlot("toolbar")}
          style={{
            height: METRICS.toolbar,
            marginTop: -1,
            background: toolbarColor || "#f0f3fa",
            backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
            // Offset background by frame (tab strip) height
            backgroundPosition: `left 0px top -55px`,
            backgroundOrigin: "border-box",
            backgroundRepeat: "repeat-x",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            color: toolbarTextColor,
            cursor: "pointer",
            position: "relative",
            ...slotOutline("toolbar"),
          }}
        >
          {/* Incognito badge removed */}
          {/* Nav buttons */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot("buttons_tint");
            }}
            title="Buttons"
            style={{ display: "flex", gap: 6 }}
          >
            <div className="pc-icon" style={{ ...icon(24) }} />
            <div className="pc-icon" style={{ ...icon(24) }} />
            <div className="pc-icon" style={{ ...icon(24) }} />
          </div>
          {/* Omnibox */}
          <div
            style={{
              height: 32,
              borderRadius: 16,
              background: omniboxBgColor,
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot("omnibox_background");
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 2,
                background: "#c4cbd7",
              }}
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot("omnibox_text");
              }}
              style={{ color: omniboxTextColor, fontSize: 13 }}
            >
              Search Google or type a URL
            </div>
          </div>
          {/* Right icons */}
          <div style={{ display: "flex", gap: 8 }}>
            <div className="pc-icon" style={{ ...icon() }} />
            <div className="pc-icon" style={{ ...icon() }} />
            <div className="pc-icon" style={{ ...icon() }} />
          </div>
        </div>

        {/* Bookmarks bar */}
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
            ...slotOutline("bookmark_text"),
          }}
        >
          <span className="pc-bookmark">Gmail</span>
          <span className="pc-bookmark">Images</span>
          <span className="pc-bookmark">Work</span>
          <span className="pc-bookmark">Docs</span>
        </div>

        {/* New Tab Page area */}
        <div
          onClick={() => setSelectedSlot("ntp_background")}
          style={{
            height: NTP_HEIGHT,
            position: "relative",
            padding: 24,
            ...ntpStyle,
            cursor: "pointer",
            ...slotOutline("ntp_background"),
          }}
        >
          {/* NTP top-right quick links */}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 12,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              className="pc-ntp-link"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot("ntp_link");
              }}
              style={{
                color: ntpLinkColor || "#1a73e8",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Gmail
            </div>
            <div
              className="pc-ntp-link"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot("ntp_link");
              }}
              style={{
                color: ntpLinkColor || "#1a73e8",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              画像
            </div>
            <div
              className="pc-icon"
              title="Apps"
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: toolbarIconCss,
              }}
            />
            <div
              className="pc-icon"
              title="Profile"
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: toolbarIconCss,
              }}
            />
          </div>
          {/* Center search */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: SEARCH_TOP,
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{
                width: 640,
                maxWidth: "90%",
                height: 48,
                borderRadius: 24,
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSlot("ntp_text");
                }}
                style={{ color: "#1f2937", fontSize: 14 }}
              >
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
          </div>

          {/* Shortcuts row */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: SHORTCUTS_TOP,
              display: "flex",
              justifyContent: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 112,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
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
        </div>
      </div>
    </Box>
  );
}
