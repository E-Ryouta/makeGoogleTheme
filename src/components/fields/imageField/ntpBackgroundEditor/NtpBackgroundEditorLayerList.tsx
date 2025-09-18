import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TrashIcon } from "../../../icons/TrashIcon";
import type { EditorLayer } from "./editorLayerModel";

type NtpBackgroundEditorLayerListProps = {
  layers: EditorLayer[];
  selectedLayerId: string | null;
  onSelect: (layerId: string) => void;
  onBringForward: (layerId: string) => void;
  onSendBackward: (layerId: string) => void;
  onRemove: (layerId: string) => void;
};

export function NtpBackgroundEditorLayerList({
  layers,
  selectedLayerId,
  onSelect,
  onBringForward,
  onSendBackward,
  onRemove,
}: NtpBackgroundEditorLayerListProps) {
  if (layers.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        追加したレイヤーがここに表示されます。
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {layers.map((layer) => (
        <Group
          key={layer.id}
          justify="space-between"
          p="xs"
          bg={
            layer.id === selectedLayerId
              ? "var(--mantine-color-blue-0)"
              : "var(--mantine-color-gray-0)"
          }
          style={{
            borderRadius: 8,
            border: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Stack gap={2} style={{ flex: 1 }}>
            <Text
              size="sm"
              fw={600}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(layer.id)}
            >
              {layer.name}
            </Text>
            <Text size="xs" c="dimmed">
              {layer.naturalWidth} × {layer.naturalHeight}
            </Text>
          </Stack>
          <Group gap="xs">
            <Tooltip label="ひとつ前面へ" openDelay={300}>
              <ActionIcon
                variant="default"
                size="sm"
                onClick={() => onBringForward(layer.id)}
                aria-label="ひとつ前面へ"
              >
                <ArrowUp size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="ひとつ背面へ" openDelay={300}>
              <ActionIcon
                variant="default"
                size="sm"
                onClick={() => onSendBackward(layer.id)}
                aria-label="ひとつ背面へ"
              >
                <ArrowDown size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="レイヤーを削除" openDelay={300}>
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                onClick={() => onRemove(layer.id)}
                aria-label="レイヤーを削除"
              >
                <TrashIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      ))}
    </Stack>
  );
}
