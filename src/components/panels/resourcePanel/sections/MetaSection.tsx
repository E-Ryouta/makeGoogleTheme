import { Group, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { isValidChromeVersion } from "../../../../lib/manifest";
import { useTheme } from "../../../../store/themeStore";

export default function MetaSection() {
  const { state, dispatch } = useTheme();
  const { t } = useTranslation();
  return (
    <Stack>
      <Group grow>
        <TextInput
          label={t("meta.themeName")}
          value={state.name}
          maxLength={75}
          error={
            state.name.trim().length === 0
              ? t("export.errors.name-required")
              : undefined
          }
          onChange={(e) =>
            dispatch({ type: "set_name", name: e.currentTarget.value })
          }
        />
        <TextInput
          label={t("meta.version")}
          value={state.version}
          placeholder="1.0"
          error={
            isValidChromeVersion(state.version)
              ? undefined
              : t("export.errors.version-invalid")
          }
          onChange={(event) =>
            dispatch({
              type: "set_version",
              version: event.currentTarget.value,
            })
          }
        />
      </Group>
    </Stack>
  );
}
