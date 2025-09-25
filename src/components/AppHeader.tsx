import { Anchor, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { ApplyGuideModal } from "./common/ApplyGuideModal";
import { ExportButton } from "./common/ExportButton";
import { RevertGuideModal } from "./common/RevertGuideModal";
import { LanguageMenu } from "./LanguageMenu";

export function AppHeader() {
  const [openedApply, { open: openApply, close: closeApply }] =
    useDisclosure(false);
  const [openedRevert, { open: openRevert, close: closeRevert }] =
    useDisclosure(false);
  const { t, i18n } = useTranslation();
  const resolvedLang = i18n.resolvedLanguage || i18n.language || "ja";
  const normalizedLanguage = resolvedLang.split("-")[0];
  const currentLanguage = normalizedLanguage === "en" ? "en" : "ja";
  const languageOptions = [
    { value: "ja", label: t("header.languageOptions.ja") },
    { value: "en", label: t("header.languageOptions.en") },
  ];

  const handleLanguageChange = (value: string) => {
    void i18n.changeLanguage(value);
  };
  return (
    <>
      <Group gap="xs" align="center">
        <Title size="h4">{t("header.title")}</Title>
        <LanguageMenu
          label={t("header.languageLabel")}
          options={languageOptions}
          currentLanguage={currentLanguage}
          onChange={handleLanguageChange}
        />
      </Group>
      <Group gap="sm" align="center">
        <Anchor component="button" onClick={openApply} underline="always">
          {t("header.applyGuide")}
        </Anchor>
        <Anchor component="button" onClick={openRevert} underline="always">
          {t("header.revertGuide")}
        </Anchor>
        <ExportButton />
      </Group>
      <ApplyGuideModal opened={openedApply} onClose={closeApply} />
      <RevertGuideModal opened={openedRevert} onClose={closeRevert} />
    </>
  );
}
