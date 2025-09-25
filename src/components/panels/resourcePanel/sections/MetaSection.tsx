import { Group, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
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
          onChange={(e) =>
            dispatch({ type: "set_name", name: e.currentTarget.value })
          }
        />
      </Group>
    </Stack>
  );
}
