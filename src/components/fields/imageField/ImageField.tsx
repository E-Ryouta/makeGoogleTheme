import { ActionIcon, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import type { ReactNode } from "react";
import { setImageWithMeta, useTheme } from "../../../store/themeStore";
import type { Action } from "../../../types/action";
import type { FileRef } from "../../../types/fileRef";
import type { ThemeState } from "../../../types/theme";
import { TrashIcon } from "../../icons/TrashIcon";

export function ImageField({
  label,
  imageKey,
  actionSlot,
}: {
  label: string;
  imageKey: keyof ThemeState["images"];
  actionSlot?: ReactNode;
}) {
  const { state, dispatch } = useTheme();
  const current = state.images[imageKey];

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text>{label}</Text>
        {current ? (
          <DeleteImageButton
            current={current}
            dispatch={dispatch}
            imageKey={imageKey}
          />
        ) : (
          <InputImageButton dispatch={dispatch} imageKey={imageKey} />
        )}
      </Group>
      {actionSlot}
    </Stack>
  );
}

const DeleteImageButton = ({
  current,
  dispatch,
  imageKey,
}: {
  current: FileRef;
  dispatch: React.Dispatch<Action>;
  imageKey: keyof ThemeState["images"];
}) => {
  return (
    <Group gap="xs">
      <Text size="sm" c="dimmed">
        {current.name}{" "}
        {current.width && current.height
          ? `(${current.width}×${current.height})`
          : ""}
      </Text>
      <Tooltip label="画像を削除" openDelay={300}>
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          aria-label="画像を削除"
          onClick={() => {
            dispatch({ type: "set_image", key: imageKey, value: undefined });
          }}
        >
          <TrashIcon />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

const InputImageButton = ({
  dispatch,
  imageKey,
}: {
  dispatch: React.Dispatch<Action>;
  imageKey: keyof ThemeState["images"];
}) => {
  return (
    <Button component="label" variant="light" size="xs">
      画像を選択する
      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setImageWithMeta(dispatch, imageKey, f);
        }}
      />
    </Button>
  );
};
