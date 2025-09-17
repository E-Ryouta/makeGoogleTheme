import { Grid, Paper, Stack } from "@mantine/core";
import { setProperty, useTheme } from "../../../../store/themeStore";
import { ImageField } from "../../../fields/imageField/ImageField";
import { NtpBackgroundPositionSelect } from "../../../fields/imageField/NtpBackgroundPositionSelect";
import { NtpBackgroundRepeatAndLogo } from "../../../fields/imageField/NtpBackgroundRepeatAndLogo";
import MajorSectionHeader from "./MajorSectionHeader";
import { NtpBackgroundScaleControl } from "./NtpBackgroundScaleControl";

export default function ImagesSection() {
  const { state, dispatch } = useTheme();
  const hasNtpBackground = Boolean(state.images.theme_ntp_background);
  const shouldScaleNtpBackground =
    state.properties.ntp_background_scale_to_cover ?? false;

  const handleSetNtpScaling = (value: boolean) => {
    setProperty(dispatch, "ntp_background_scale_to_cover", value);
  };
  return (
    <Stack>
      <MajorSectionHeader label="画像" />
      <ImageField label="フレームの背景画像" imageKey="theme_frame" />
      <ImageField label="ツールバーの背景画像" imageKey="theme_toolbar" />
      <ImageField label="タブの背景画像" imageKey="theme_tab_background" />
      <ImageField
        label="ホーム画面の背景画像"
        imageKey="theme_ntp_background"
      />
      {hasNtpBackground && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NtpBackgroundPositionSelect />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NtpBackgroundRepeatAndLogo />
              </Grid.Col>
            </Grid>
            <NtpBackgroundScaleControl
              shouldScale={shouldScaleNtpBackground}
              onChange={handleSetNtpScaling}
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
