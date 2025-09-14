import { Title } from "@mantine/core";
import { ExportButton } from "./common/ExportButton";

export function AppHeader() {
  return (
    <>
      <Title order={4}>Chrome Theme Builder</Title>
      <ExportButton />
    </>
  );
}
