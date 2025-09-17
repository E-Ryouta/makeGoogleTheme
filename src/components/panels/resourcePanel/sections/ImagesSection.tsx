import { Grid, Paper, Stack } from "@mantine/core";
import { SettingCard } from "../../../common/SettingCard";
import { setProperty, useTheme } from "../../../../store/themeStore";
import { ImageField } from "../../../fields/imageField/ImageField";
import { NtpBackgroundPositionSelect } from "../../../fields/imageField/NtpBackgroundPositionSelect";
import { NtpBackgroundRepeatAndLogo } from "../../../fields/imageField/NtpBackgroundRepeatAndLogo";
import MajorSectionHeader from "./MajorSectionHeader";
import { NtpBackgroundScaleControl } from "../../../fields/imageField/NtpBackgroundScaleControl";
import { NtpEdgeColorButton } from "../../../fields/imageField/NtpEdgeColorButton";

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
                <SettingCard
                  title="表示位置"
                  description="背景画像を表示する基準を選択します。"
                >
                  <NtpBackgroundPositionSelect label={null} />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title="繰り返し"
                  description="背景画像のタイル表示を指定します。"
                >
                  <NtpBackgroundRepeatAndLogo label={null} />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title="拡大・縮小"
                  description="背景画像をホーム画面全体に広げるかどうかを設定します。"
                >
                  <NtpBackgroundScaleControl
                    shouldScale={shouldScaleNtpBackground}
                    onChange={handleSetNtpScaling}
                  />
                </SettingCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <SettingCard
                  title="周辺色の取り込み"
                  description="画像でよく使われる色を自動反映します。"
                >
                  <NtpEdgeColorButton />
                </SettingCard>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
