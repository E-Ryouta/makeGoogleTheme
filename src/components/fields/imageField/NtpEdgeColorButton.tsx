import { Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { getDominantEdgeColor } from "../../../lib/imageColors";
import { setColor, useTheme } from "../../../store/themeStore";
import type { RGB, RGBA } from "../../../types/theme";

type Status = "idle" | "loading" | "error";

export function NtpEdgeColorButton() {
  const { state, dispatch } = useTheme();
  const ntpImage = state.images.theme_ntp_background;
  const [edgeColor, setEdgeColor] = useState<RGB | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    if (!ntpImage) {
      setEdgeColor(null);
      setStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setStatus("loading");
    getDominantEdgeColor(ntpImage.blob)
      .then((color) => {
        if (cancelled) return;
        setEdgeColor(color);
        setStatus(color ? "idle" : "error");
      })
      .catch(() => {
        if (cancelled) return;
        setEdgeColor(null);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [ntpImage]);

  if (!ntpImage) return null;

  const handleApply = () => {
    if (!edgeColor) return;
    const current = state.colors.ntp_background as RGB | RGBA | undefined;
    const alpha =
      Array.isArray(current) && current.length === 4
        ? ((current as RGBA)[3] ?? 1)
        : 1;
    setColor(dispatch, "ntp_background", [...edgeColor, alpha] as any);
  };

  return (
    <Stack gap="xs">
      <Button
        size="sm"
        variant="light"
        disabled={!edgeColor || status === "loading"}
        loading={status === "loading"}
        onClick={handleApply}
      >
        画像の外側の色を背景に反映
      </Button>
    </Stack>
  );
}
