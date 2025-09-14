import { Grid, Paper, Stack } from "@mantine/core";
import { ImageField } from "../../../fields/imageField/ImageField";
import MajorSectionHeader from "./MajorSectionHeader";
import { NtpBackgroundPositionSelect } from "../../../fields/imageField/NtpBackgroundPositionSelect";
import { NtpBackgroundRepeatAndLogo } from "../../../fields/imageField/NtpBackgroundRepeatAndLogo";
import { useTheme } from "../../../../store/themeStore";

export default function ImagesSection() {
  const { state } = useTheme();
  const hasNtpBackground = Boolean(state.images.theme_ntp_background);
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
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NtpBackgroundPositionSelect />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NtpBackgroundRepeatAndLogo />
            </Grid.Col>
          </Grid>
        </Paper>
      )}
    </Stack>
  );
}
