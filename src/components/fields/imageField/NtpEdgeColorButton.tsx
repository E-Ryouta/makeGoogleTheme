import { Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  getEdgeColorSuggestions,
  type EdgeColorSuggestions,
} from "../../../lib/imageColors";
import { setColor, useTheme } from "../../../store/themeStore";
import type { RGB, RGBA, ThemeState } from "../../../types/theme";

type Status = "idle" | "loading" | "error";

export function NtpEdgeColorButton() {
  const { state, dispatch } = useTheme();
  const ntpImage = state.images.theme_ntp_background;
  const [suggestions, setSuggestions] = useState<EdgeColorSuggestions | null>(
    null,
  );
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    if (!ntpImage) {
      setSuggestions(null);
      setStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setStatus("loading");
    getEdgeColorSuggestions(ntpImage.blob)
      .then((result) => {
        if (cancelled) return;
        setSuggestions(result);
        setStatus(result ? "idle" : "error");
      })
      .catch(() => {
        if (cancelled) return;
        setSuggestions(null);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [ntpImage]);

  if (!ntpImage) return null;

  const applyColor = (key: keyof ThemeState["colors"], rgb: RGB) => {
    const current = state.colors[key];
    if (Array.isArray(current) && current.length === 4) {
      const alpha = (current as RGBA)[3] ?? 1;
      setColor(dispatch, key, [...rgb, alpha] as RGBA);
      return;
    }
    setColor(dispatch, key, rgb);
  };

  const handleApplyBackground = () => {
    if (!suggestions) return;
    applyColor("ntp_background", suggestions.background);
  };

  const handleApplyChrome = () => {
    if (!suggestions) return;
    applyColor("frame", suggestions.frame);
    applyColor("toolbar", suggestions.toolbar);
  };

  return (
    <Stack gap="xs">
      <Button
        size="sm"
        variant="light"
        disabled={!suggestions || status === "loading"}
        loading={status === "loading"}
        onClick={handleApplyBackground}
      >
        画像の外側の色を背景に反映
      </Button>
      <Button
        size="sm"
        variant="default"
        disabled={!suggestions || status === "loading"}
        loading={status === "loading"}
        onClick={handleApplyChrome}
      >
        <span style={{ fontSize: "0.8em" }}>
          フレーム・ツールバーに合う色を反映
        </span>
      </Button>
    </Stack>
  );
}
