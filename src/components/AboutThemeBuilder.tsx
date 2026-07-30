import {
  Accordion,
  Box,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Download, Image, Palette, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { THEME_BUILDER_GUIDE_ID } from "../constants/ui";

const STEP_ICONS = [Image, Palette, Download] as const;

export function AboutThemeBuilder() {
  const { t } = useTranslation();
  const steps = ["image", "design", "download"] as const;
  const questions = ["free", "privacy", "formats", "apply"] as const;

  return (
    <Box
      component="section"
      id={THEME_BUILDER_GUIDE_ID}
      py={{ base: 40, sm: 56 }}
      style={{ scrollMarginTop: 80 }}
    >
      <Container size="lg">
        <Stack gap="xl">
          <Box maw={720}>
            <Text size="xs" fw={700} c="blue.7" tt="uppercase" lts={1.1}>
              {t("about.eyebrow")}
            </Text>
            <Title order={2} size="h2" mt={6}>
              {t("about.title")}
            </Title>
            <Text c="dimmed" mt="sm" lh={1.75}>
              {t("about.description")}
            </Text>
          </Box>

          {/* 実際の作業順に説明し、SEO向けの文章が操作方法の理解にも役立つようにする。 */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <Paper key={step} withBorder radius="md" p="lg">
                  <ThemeIcon variant="light" size={38} radius="xl">
                    <Icon size={19} aria-hidden="true" />
                  </ThemeIcon>
                  <Text size="xs" fw={700} c="blue.7" mt="md">
                    {t("about.stepLabel", { number: index + 1 })}
                  </Text>
                  <Title order={3} size="h4" mt={4}>
                    {t(`about.steps.${step}.title`)}
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.7} mt="xs">
                    {t(`about.steps.${step}.description`)}
                  </Text>
                </Paper>
              );
            })}
          </SimpleGrid>

          <Paper withBorder radius="md" p={{ base: "md", sm: "xl" }}>
            <Stack gap="xs">
              <ThemeIcon variant="light" color="teal" size={36} radius="xl">
                <ShieldCheck size={18} aria-hidden="true" />
              </ThemeIcon>
              <Title order={2} size="h3">
                {t("about.privacyTitle")}
              </Title>
              <Text c="dimmed" lh={1.75}>
                {t("about.privacyDescription")}
              </Text>
            </Stack>
          </Paper>

          <Box>
            <Title order={2} size="h3" mb="sm">
              {t("about.faqTitle")}
            </Title>
            <Accordion variant="separated" radius="md">
              {questions.map((question) => (
                <Accordion.Item key={question} value={question}>
                  <Accordion.Control>
                    {t(`about.faq.${question}.question`)}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" lh={1.75}>
                      {t(`about.faq.${question}.answer`)}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
