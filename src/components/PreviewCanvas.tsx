import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mantine/core";
import { useSelectedSlot, useTheme } from "../store/themeStore";
import { colorToCss, rgbToHex } from "../lib/color";

export default function PreviewCanvas() {
  const { state } = useTheme();
  const { selectedSlot, setSelectedSlot } = useSelectedSlot();

  // Window mode to preview variants in manifest (active/inactive only)
  const [mode, setMode] = useState<"active" | "inactive">("active");

  // Frame color switches with mode
  const frameColor = useMemo(() => {
    const c =
      mode === "inactive"
        ? (state.colors as any).frame_inactive
        : state.colors.frame;
    return (
      colorToCss(c) || rgbToHex(c ? ([c[0], c[1], c[2]] as any) : undefined)
    );
  }, [mode, state.colors]);
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
  const activeTabTextColor =
    colorToCss(state.colors.tab_text) ||
    rgbToHex(
      state.colors.tab_text
        ? ([
            state.colors.tab_text[0],
            state.colors.tab_text[1],
            state.colors.tab_text[2],
          ] as any)
        : undefined,
    );

  // Decide inactive tab text by mode (incognito removed)
  const inactiveTabTextColor = useMemo(() => {
    const colors = state.colors as any;
    const c =
      mode === "inactive"
        ? colors.tab_background_text_inactive || colors.tab_background_text
        : colors.tab_background_text;
    return (
      colorToCss(c) || rgbToHex(c ? ([c[0], c[1], c[2]] as any) : undefined)
    );
  }, [mode, state.colors]);

  // Inactive tab background by mode (incognito removed)
  const inactiveTabBgColor = useMemo(() => {
    const colors = state.colors as any;
    const c =
      mode === "inactive"
        ? colors.background_tab_inactive || colors.background_tab
        : colors.background_tab;
    return colorToCss(c);
  }, [mode, state.colors]);
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

  const toolbarBgUrl = useMemo(() => {
    const f = state.images.theme_toolbar;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_toolbar]);

  const tabBgUrl = useMemo(() => {
    const f = state.images.theme_tab_background;
    if (!f) return undefined;
    return URL.createObjectURL(f.blob);
  }, [state.images.theme_tab_background]);

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
    prevUrl.current.tab = tabBgUrl;
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
        if (a === "bottom") return "center calc(100% - 40px)"; // avoid sub-pixel cropping at bottom
        if (a === "center") return "center center";
        // Adjust any "* bottom" to compensate for transform scale rounding
        if (a.endsWith(" bottom")) {
          const x = a.split(" ")[0] as "left" | "center" | "right";
          return `${x} calc(100% - 40px)`;
        }
        return a;
      }
      return "center center";
    })(),
    backgroundRepeat: state.properties.ntp_background_repeat || "no-repeat",
    // 画像があっても余白は背景色で塗る（実機同様）
    backgroundColor: ntpBgColor || "#ffffff",
  };

  const slotOutline = (slot: string) =>
    selectedSlot === slot
      ? { outline: "2px solid #4c9aff", outlineOffset: 0 }
      : {};

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
    tabStrip: 40,
    toolbar: 64,
    bookmarks: 40,
  } as const;
  const NTP_HEIGHT = Math.max(
    360,
    BASE_HEIGHT - (METRICS.tabStrip + METRICS.toolbar + METRICS.bookmarks),
  );
  const SEARCH_TOP = Math.round(NTP_HEIGHT * 0.2); // ~20% from top of NTP
  const SHORTCUTS_TOP = SEARCH_TOP + 120;

  return (
    <Box ref={containerRef} h={"calc(100vh - 140px)"}>
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <style>{`
        .pc-icon, .pc-winbtn {
          transition: filter .12s ease, opacity .12s ease, background-color .12s ease;
        }
        .pc-icon:hover, .pc-winbtn:hover {
          filter: brightness(1.18);
        }
        .pc-tab-inactive {
          transition: background-color .12s ease, color .12s ease;
        }
        .pc-tab-inactive:hover {
          filter: brightness(1.08);
        }
        .pc-bookmark, .pc-ntp-link {
          transition: filter .12s ease, color .12s ease;
        }
        .pc-bookmark:hover, .pc-ntp-link:hover {
          filter: brightness(1.15);
        }
      `}</style>
        {/* Mode toggle (incognito removed) */}
        <div style={{ display: "flex", gap: 6, padding: "8px 8px 0" }}>
          {[
            { key: "active", label: "通常" },
            { key: "inactive", label: "非アクティブ" },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => setMode(b.key as any)}
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: mode === b.key ? "#eef2ff" : "#fff",
                cursor: "pointer",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        {/* Tab strip / frame */}
        <div
          style={{
            background: frameColor || "#e5e9f6",
            backgroundImage: frameBgUrl ? `url(${frameBgUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            padding: "6px 12px 0",
            userSelect: "none",
          }}
          onClick={() => setSelectedSlot("frame")}
        >
          {/* Window controls (top-right) */}
          <div style={{ position: "relative", height: 0 }}>
            <div
              style={{
                position: "absolute",
                right: 6,
                top: -4,
                display: "flex",
                gap: 6,
              }}
            >
              {["_", "□", "×"].map((s, i) => (
                <div
                  key={i}
                  title={i === 0 ? "Minimize" : i === 1 ? "Maximize" : "Close"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSlot("buttons_tint");
                  }}
                  className="pc-winbtn"
                  style={{
                    width: 26,
                    height: 18,
                    borderRadius: 4,
                    background: windowButtonCss,
                    display: "grid",
                    placeItems: "center",
                    color: toolbarTextColor || "#fff",
                    fontSize: 10,
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
              gap: 8,
              height: METRICS.tabStrip,
              position: "relative",
              ...slotOutline("frame"),
              backgroundImage: tabBgUrl ? `url(${tabBgUrl})` : undefined,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Active tab */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot("tab_background_text");
              }}
              style={{
                // Use toolbar color to mimic how active tab merges with toolbar
                background: toolbarColor || frameColor || "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: "8px 16px",
                minWidth: 120,
                boxShadow: "0 -1px 0 rgba(0,0,0,0.12) inset",
                cursor: "pointer",
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
                  style={{ color: activeTabTextColor || "#444", fontSize: 13 }}
                >
                  New Tab
                </div>
              </div>
            </div>

            {/* Inactive tab */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot("tab_background_text");
              }}
              className="pc-tab-inactive"
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: "8px 16px",
                minWidth: 120,
                cursor: "pointer",
                color: inactiveTabTextColor || "#65768a",
                background: inactiveTabBgColor || "transparent",
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
                <div
                  style={{
                    color: inactiveTabTextColor || "#65768a",
                    fontSize: 13,
                  }}
                >
                  Docs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div
          onClick={() => setSelectedSlot("toolbar")}
          style={{
            height: METRICS.toolbar,
            background: toolbarColor || "#f0f3fa",
            backgroundImage: toolbarBgUrl ? `url(${toolbarBgUrl})` : undefined,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 16px",
            color: toolbarTextColor,
            cursor: "pointer",
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
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
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
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 14px",
            color: bookmarkTextColor || "#2f3b46",
            cursor: "pointer",
            borderBottom: "1px solid #e6e8ee",
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
                style={{ color: ntpTextColor || "#1f2937", fontSize: 14 }}
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
                    color: ntpLinkColor || "#1a73e8",
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
