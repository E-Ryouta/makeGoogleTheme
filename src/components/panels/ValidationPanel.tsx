import { Alert, Anchor, List, Stack, Text } from "@mantine/core";
import { contrastRatio } from "../../lib/color";
import { useSelectedSlot, useTheme } from "../../store/themeStore";

type Issue = { id: string; message: string; slot?: string; severity: "error" | "warn" };

export default function ValidationPanel() {
  const { state } = useTheme();
  const { setSelectedSlot } = useSelectedSlot();

  const issues: Issue[] = [];
  if (!state.name) issues.push({ id: "name", message: "テーマ名は必須です", severity: "error" });
  if (!state.version) issues.push({ id: "version", message: "バージョンは必須です", severity: "error" });

  const toRGB = (x?: any) => (x && Array.isArray(x) ? ([x[0], x[1], x[2]] as any) : undefined);
  const c1 = contrastRatio(toRGB(state.colors.frame), toRGB(state.colors.tab_background_text));
  if (c1 !== undefined && c1 < 4.5) {
    issues.push({ id: "contrast/frame", message: `コントラストが低い: フレーム × タブ文字 (${c1.toFixed(2)})`, severity: "warn", slot: "frame" });
  }
  const c2 = contrastRatio(toRGB(state.colors.toolbar), toRGB(state.colors.bookmark_text));
  if (c2 !== undefined && c2 < 4.5) {
    issues.push({ id: "contrast/toolbar", message: `コントラストが低い: ツールバー × ブックマーク文字 (${c2.toFixed(2)})`, severity: "warn", slot: "toolbar" });
  }

  const ntp = state.images.theme_ntp_background;
  if (ntp && ntp.width && ntp.width < 1920) {
    issues.push({ id: "ntp/size", message: `新しいタブの背景幅が ${ntp.width}px（推奨は 1920px 以上）`, severity: "warn", slot: "ntp_background" });
  }

  const estBytes = Object.values(state.images).reduce((s, f) => s + (f?.blob.size || 0), 0);
  if (estBytes > 5 * 1024 * 1024) {
    issues.push({ id: "size/zip", message: `画像の合計サイズが ${(estBytes / (1024 * 1024)).toFixed(2)}MB（5MB 超）`, severity: "warn" });
  }

  return (
    <Stack>
      <Text fw={600}>Issues</Text>
      {issues.length === 0 ? (
        <Alert color="green">問題は見つかりません</Alert>
      ) : (
        <List spacing="xs">
          {issues.map((it) => (
            <List.Item key={it.id}>
              <Text c={it.severity === "warn" ? "orange" : "red"}>
                {it.slot ? (
                  <Anchor component="button" onClick={() => setSelectedSlot(it.slot as any)}>
                    {it.message}
                  </Anchor>
                ) : (
                  it.message
                )}
              </Text>
            </List.Item>
          ))}
        </List>
      )}
    </Stack>
  );
}
