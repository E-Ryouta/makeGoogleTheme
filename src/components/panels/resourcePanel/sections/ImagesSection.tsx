import { Button, Grid, Paper, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { setProperty, useTheme } from "../../../../store/themeStore";
import { SettingCard } from "../../../common/SettingCard";
import { ImageField } from "../../../fields/imageField/ImageField";
import { NtpBackgroundEditorModal } from "../../../fields/imageField/NtpBackgroundEditorModal";
import { NtpBackgroundPositionSelect } from "../../../fields/imageField/NtpBackgroundPositionSelect";
import { NtpBackgroundRepeatAndLogo } from "../../../fields/imageField/NtpBackgroundRepeatAndLogo";
import { NtpBackgroundScaleControl } from "../../../fields/imageField/NtpBackgroundScaleControl";
import { NtpEdgeColorButton } from "../../../fields/imageField/NtpEdgeColorButton";
import MajorSectionHeader from "./MajorSectionHeader";

export default function ImagesSection() {
  const { state, dispatch } = useTheme();
  const { t } = useTranslation();
  const [editorOpened, { open: openEditor, close: closeEditor }] =
    useDisclosure(false);
  const hasNtpBackground = Boolean(state.images.theme_ntp_background);
  const shouldScaleNtpBackground =
    state.properties.ntp_background_scale_to_cover ?? false;

  const handleSetNtpScaling = (value: boolean) => {
    setProperty(dispatch, "ntp_background_scale_to_cover", value);
  };
  return (
    <Stack>
      <MajorSectionHeader label={t("images.title")} />
      <ImageField
        label={t("images.frameBackground")}
        imageKey="theme_frame"
      />
      <ImageField
        label={t("images.toolbarBackground")}
        imageKey="theme_toolbar"
      />
      <ImageField
        label={t("images.tabBackground")}
        imageKey="theme_tab_background"
      />
      <ImageField
        label={t("images.ntpBackground")}
        imageKey="theme_ntp_background"
        actionSlot={
          <Button variant="default" size="xs" onClick={openEditor}>
            {t("images.editBackground")}
          </Button>
        }
      />
      {hasNtpBackground && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title={t("images.positionTitle")}
                  description={t("images.positionDescription")}
                >
                  <NtpBackgroundPositionSelect label={null} />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title={t("images.repeatTitle")}
                  description={t("images.repeatDescription")}
                >
                  <NtpBackgroundRepeatAndLogo label={null} />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title={t("images.scaleTitle")}
                  description={t("images.scaleDescription")}
                >
                  <NtpBackgroundScaleControl
                    shouldScale={shouldScaleNtpBackground}
                    onChange={handleSetNtpScaling}
                  />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title={t("images.edgeTitle")}
                  description={t("images.edgeDescription")}
                >
                  <NtpEdgeColorButton />
                </SettingCard>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}
      <NtpBackgroundEditorModal
        opened={editorOpened}
        onClose={closeEditor}
        dispatch={dispatch}
        current={state.images.theme_ntp_background}
      />
    </Stack>
  );
}
