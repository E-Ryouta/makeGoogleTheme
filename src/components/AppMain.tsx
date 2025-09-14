import { Box, Grid, GridCol, Paper, ScrollArea } from "@mantine/core";
import PreviewCanvas from "./panels/previewPanel/PreviewPanel";
import ResourcePanel from "./panels/resourcePanel/ResourcePanel";

export function AppMain() {
  return (
    <Grid>
      <GridCol span={{ lg: 4 }}>
        <Paper withBorder>
          <ScrollArea h={"calc(100vh - 110px)"}>
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
  );
}
