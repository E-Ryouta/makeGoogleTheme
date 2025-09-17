import { Stack } from "@mantine/core";
import ColorField from "../../../fields/ColorField";
import MajorSectionHeader from "./MajorSectionHeader";
import SectionHeader from "./SectionHeader";

export default function ColorsSection() {
  return (
    <Stack>
      <MajorSectionHeader label="色" />
      <SectionHeader label="フレーム" />
      <ColorField label="フレーム" colorKey="frame" />
      <ColorField label="フレーム (ボタン)" colorKey="button_background" />

      <SectionHeader label="ツールバー" />
      <ColorField label="ツールバー（背景）" colorKey="toolbar" />
      <ColorField label="ツールバー（文字）" colorKey="toolbar_text" />
      <ColorField label="ツールバー (ボタン)" colorKey="toolbar_button_icon" />

      {/* Tabs removed */}

      <SectionHeader label="ブックマーク" />
      <ColorField label="ブックマーク（文字）" colorKey="bookmark_text" />

      <SectionHeader label="ホームページ" />
      <ColorField label="ホームページ (背景)" colorKey="ntp_background" />
      <ColorField label="ホームページ (文字)" colorKey="ntp_text" />
      <ColorField label="ホームページ (リンク)" colorKey="ntp_link" />

      <SectionHeader label="オムニボックス" />
      <ColorField label="オムニボックス(背景)" colorKey="omnibox_background" />
      <ColorField label="オムニボックス(文字)" colorKey="omnibox_text" />
    </Stack>
  );
}
