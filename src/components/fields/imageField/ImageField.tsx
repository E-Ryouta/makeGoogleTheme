import { ActionIcon, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageValidationError,
  SUPPORTED_IMAGE_TYPES,
} from "../../../lib/imageValidation";
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
  const { t } = useTranslation();
  return (
    <Group gap="xs">
      <Text size="sm" c="dimmed">
        {current.name}{" "}
        {current.width && current.height
          ? `(${current.width}×${current.height})`
          : ""}
      </Text>
      <Tooltip label={t("imageField.deleteTooltip")} openDelay={300}>
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          aria-label={t("imageField.deleteAria")}
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await setImageWithMeta(dispatch, imageKey, file);
    } catch (error) {
      const key =
        error instanceof ImageValidationError ? error.code : "decode-failed";
      setErrorMessage(t(`imageValidation.${key}`));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap={4} align="flex-end">
      <Button component="label" variant="light" size="xs" loading={isLoading}>
        {t("imageField.select")}
        <input
          hidden
          type="file"
          accept={SUPPORTED_IMAGE_TYPES.join(",")}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </Button>
      {errorMessage && (
        <Text size="xs" c="red" role="alert">
          {errorMessage}
        </Text>
      )}
    </Stack>
  );
};
