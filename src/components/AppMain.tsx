import { Box, Grid, GridCol, Paper, ScrollArea, Stack } from "@mantine/core";
import { AboutThemeBuilder } from "./AboutThemeBuilder";
import { AppIntro } from "./AppIntro";
import PreviewCanvas from "./panels/previewPanel/PreviewPanel";
import ResourcePanel from "./panels/resourcePanel/ResourcePanel";

export function AppMain() {
  return (
    <Stack gap="md">
      <AppIntro />
      <Grid>
        <GridCol span={{ lg: 4 }}>
          <Paper withBorder>
            <ScrollArea h={{ base: 560, lg: "calc(100vh - 205px)" }}>
              <Box p="md">
                <ResourcePanel />
              </Box>
            </ScrollArea>
          </Paper>
        </GridCol>
        <GridCol span={{ lg: 8 }}>
          <PreviewCanvas />
        </GridCol>
      </Grid>
      {/* 長い説明は編集領域の後ろに置き、テーマ作成中の視線と操作を妨げない。 */}
      <AboutThemeBuilder />
    </Stack>
  );
}
