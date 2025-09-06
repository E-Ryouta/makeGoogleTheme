import { Divider, Stack, Text, TextInput } from "@mantine/core";
import { useTheme } from "../../store/themeStore";
import ColorField from "./fields/ColorField";
import ImageField from "./fields/ImageField";
import TintField from "./fields/TintField";

export default function ResourcePanel() {
  const { state, dispatch } = useTheme();
  return (
    <Stack>
      <TextInput
        label="Name"
        value={state.name}
        onChange={(e) =>
          dispatch({ type: "set_name", name: e.currentTarget.value })
        }
      />
      <TextInput
        label="Version"
        value={state.version}
        onChange={(e) =>
          dispatch({ type: "set_version", version: e.currentTarget.value })
        }
      />
      <Divider my="sm" label="Images" />
      <ImageField label="Frame image" imageKey="theme_frame" />
      <ImageField label="Toolbar image" imageKey="theme_toolbar" />
      <ImageField
        label="Tab background image"
        imageKey="theme_tab_background"
      />
      <ImageField
        label="New Tab background image"
        imageKey="theme_ntp_background"
        options={{ position: true, repeat: true }}
      />
      <Divider my="sm" label="Colors" />
      <Text fw={600} size="sm">
        Frame
      </Text>
      <ColorField label="Frame" colorKey="frame" />
      <ColorField label="Frame (inactive)" colorKey="frame_inactive" />
      {/* incognito variants hidden */}

      <Divider my="xs" />
      <Text fw={600} size="sm">
        Toolbar
      </Text>
      <ColorField label="Toolbar" colorKey="toolbar" />
      <ColorField label="Toolbar text" colorKey="toolbar_text" />
      <ColorField label="Toolbar button icon" colorKey="toolbar_button_icon" />
      <ColorField
        label="Window buttons (right top)"
        colorKey="button_background"
      />

      <Divider my="xs" />
      <Text fw={600} size="sm">
        Tabs
      </Text>
      <ColorField label="Tab text (active)" colorKey="tab_text" />
      <ColorField label="Tab text (inactive)" colorKey="tab_background_text" />
      <ColorField
        label="Tab text (inactive/inactive)"
        colorKey="tab_background_text_inactive"
      />
      {/* incognito variants hidden */}
      <ColorField label="Background (inactive tab)" colorKey="background_tab" />
      <ColorField
        label="Background (inactive + inactive)"
        colorKey="background_tab_inactive"
      />
      {/* incognito variants hidden */}

      <Divider my="xs" />
      <Text fw={600} size="sm">
        Bookmarks
      </Text>
      <ColorField label="Bookmark bar text" colorKey="bookmark_text" />

      <Divider my="xs" />
      <Text fw={600} size="sm">
        New Tab Page
      </Text>
      <ColorField label="New Tab background color" colorKey="ntp_background" />
      <ColorField label="New Tab text" colorKey="ntp_text" />
      <ColorField label="New Tab link" colorKey="ntp_link" />

      <Divider my="xs" />
      <Text fw={600} size="sm">
        Omnibox
      </Text>
      <ColorField label="Omnibox background" colorKey="omnibox_background" />
      <ColorField label="Omnibox text" colorKey="omnibox_text" />

      <Divider my="sm" label="Tints" />
      <TintField label="Buttons tint" tintKey="buttons" />
    </Stack>
  );
}
