import { Group, Stack, TextInput } from "@mantine/core";
import { useTheme } from "../../../../store/themeStore";

export default function MetaSection() {
  const { state, dispatch } = useTheme();
  return (
    <Stack>
      <Group grow>
        <TextInput
          label="テーマ名"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: "set_name", name: e.currentTarget.value })
          }
        />
      </Group>
    </Stack>
  );
}
