import { Anchor, Box, Group, Paper, Text, Title } from "@mantine/core";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { THEME_BUILDER_GUIDE_ID } from "../constants/ui";

export function AppIntro() {
  const { t } = useTranslation();

  return (
    <Paper
      component="section"
      withBorder
      px={{ base: "md", sm: "lg" }}
      py="sm"
      radius="md"
      bg="blue.0"
    >
      <Group justify="space-between" align="center" gap="sm" wrap="wrap">
        <Box>
          <Title order={1} size="h3">
            {t("intro.title")}
          </Title>
          <Text size="sm" c="dimmed" mt={2}>
            {t("intro.description")}
          </Text>
        </Box>
        <Anchor
          href={`#${THEME_BUILDER_GUIDE_ID}`}
          size="sm"
          fw={600}
          underline="hover"
        >
          <Group component="span" gap={6} wrap="nowrap">
            {t("intro.guideLink")}
            <ArrowDown size={15} aria-hidden="true" />
          </Group>
        </Anchor>
      </Group>
    </Paper>
  );
}
