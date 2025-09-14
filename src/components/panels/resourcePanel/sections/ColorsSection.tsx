import { Divider, Stack } from "@mantine/core";
import ColorField from "../../../fields/ColorField";
import SectionHeader from "./SectionHeader";
import MajorSectionHeader from "./MajorSectionHeader";

export default function ColorsSection() {
  return (
    <Stack>
      <MajorSectionHeader label="Colors" />
      <SectionHeader label="Frame" />
      <ColorField label="Frame" colorKey="frame" />

      <SectionHeader label="Toolbar" />
      <ColorField label="Toolbar" colorKey="toolbar" />
      <ColorField label="Toolbar text" colorKey="toolbar_text" />
      <ColorField label="Toolbar button icon" colorKey="toolbar_button_icon" />
      <ColorField
        label="Window buttons (right top)"
        colorKey="button_background"
      />

      {/* Tabs removed */}

      <SectionHeader label="Bookmarks" />
      <ColorField label="Bookmark bar text" colorKey="bookmark_text" />

      <SectionHeader label="New Tab Page" />
      <ColorField label="New Tab background color" colorKey="ntp_background" />
      <ColorField label="New Tab text" colorKey="ntp_text" />
      <ColorField label="New Tab link" colorKey="ntp_link" />

      <SectionHeader label="Omnibox" />
      <ColorField label="Omnibox background" colorKey="omnibox_background" />
      <ColorField label="Omnibox text" colorKey="omnibox_text" />
    </Stack>
  );
}
