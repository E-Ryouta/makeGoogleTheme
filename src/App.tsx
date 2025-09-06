import "@mantine/core/styles.css";
import {
  ActionIcon,
  AppShell,
  Box,
  Grid,
  GridCol,
  MantineProvider,
  Paper,
  ScrollArea,
  Title,
  Tooltip,
} from "@mantine/core";
import { theme } from "./theme";
import { ThemeProvider } from "./store/themeStore";
import ResourcePanel from "./components/panels/ResourcePanel";
import PreviewCanvas from "./components/PreviewCanvas";
import ValidationPanel from "./components/panels/ValidationPanel";
import ExportPanel from "./components/panels/ExportPanel";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ThemeProvider>
        <AppShell padding="md" header={{ height: 60 }}>
          <AppShell.Header
            pl={20}
            pr={20}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Title order={4}>Chrome Theme Builder</Title>
            <Tooltip
              label="ブラウザ上で Chrome 用のテーマを作成・プレビューし、ZIP として保存できます。左で画像と色を設定すると中央の見た目が変わり、右に不足や注意点が日本語で表示されます。"
              multiline
              maw={360}
            >
              <ActionIcon variant="subtle" aria-label="Help">
                ?
              </ActionIcon>
            </Tooltip>
          </AppShell.Header>
          <AppShell.Main>
            <Grid gutter="md">
              <GridCol span={{ base: 12, md: 4, lg: 3 }}>
                <Paper p="md" withBorder>
                  <ScrollArea h={"calc(100vh - 140px)"}>
                    <ResourcePanel />
                  </ScrollArea>
                </Paper>
              </GridCol>
              {/* Wider preview on large screens (1920x1080 target) */}
              <GridCol span={{ base: 12, md: 8, lg: 7 }}>
                <Paper p="md" withBorder>
                  <Box>
                    <PreviewCanvas />
                  </Box>
                </Paper>
              </GridCol>
              <GridCol span={{ base: 12, lg: 2 }}>
                <Paper p="md" withBorder>
                  <ScrollArea h={"calc(100vh - 140px)"}>
                    <ValidationPanel />
                    <div style={{ height: 16 }} />
                    <ExportPanel />
                  </ScrollArea>
                </Paper>
              </GridCol>
            </Grid>
          </AppShell.Main>
        </AppShell>
      </ThemeProvider>
    </MantineProvider>
  );
}
