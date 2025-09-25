import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import ColorField from "../../../fields/ColorField";
import MajorSectionHeader from "./MajorSectionHeader";
import SectionHeader from "./SectionHeader";

export default function ColorsSection() {
  const { t } = useTranslation();
  return (
    <Stack>
      <MajorSectionHeader label={t("colors.title") ?? ""} />
      <SectionHeader label={t("colors.frame")} />
      <ColorField label={t("colors.frame")} colorKey="frame" />
      <ColorField label={t("colors.frameButton")} colorKey="button_background" />

      <SectionHeader label={t("colors.toolbar")} />
      <ColorField label={t("colors.toolbarBackground")} colorKey="toolbar" />
      <ColorField label={t("colors.toolbarText")} colorKey="toolbar_text" />
      <ColorField label={t("colors.toolbarButton")} colorKey="toolbar_button_icon" />

      {/* Tabs removed */}

      <SectionHeader label={t("colors.bookmarks")} />
      <ColorField label={t("colors.bookmarkText")} colorKey="bookmark_text" />

      <SectionHeader label={t("colors.homepage")} />
      <ColorField label={t("colors.homepageBackground")} colorKey="ntp_background" />
      <ColorField label={t("colors.homepageText")} colorKey="ntp_text" />
      <ColorField label={t("colors.homepageLink")} colorKey="ntp_link" />

      <SectionHeader label={t("colors.omnibox")} />
      <ColorField label={t("colors.omniboxBackground")} colorKey="omnibox_background" />
      <ColorField label={t("colors.omniboxText")} colorKey="omnibox_text" />
    </Stack>
  );
}
