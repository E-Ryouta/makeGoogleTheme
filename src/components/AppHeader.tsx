import { Anchor, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ExportButton } from "./common/ExportButton";
import { ApplyGuideModal } from "./common/ApplyGuideModal";
import { RevertGuideModal } from "./common/RevertGuideModal";

export function AppHeader() {
  const [openedApply, { open: openApply, close: closeApply }] = useDisclosure(false);
  const [openedRevert, { open: openRevert, close: closeRevert }] = useDisclosure(false);
  return (
    <>
      <Title order={4}>Chrome Theme Builder</Title>
      <Group gap="sm">
        <Anchor component="button" onClick={openApply} underline="always">
          適用方法
        </Anchor>
        <Anchor component="button" onClick={openRevert} underline="always">
          戻す方法
        </Anchor>
        <ExportButton />
      </Group>
      <ApplyGuideModal opened={openedApply} onClose={closeApply} />
      <RevertGuideModal opened={openedRevert} onClose={closeRevert} />
    </>
  );
}
