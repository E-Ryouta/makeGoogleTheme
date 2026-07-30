import "@mantine/core/styles.css";
import { AppShell } from "@mantine/core";
import { AppHeader } from "./components/AppHeader";
import { AppMain } from "./components/AppMain";

export default function App() {
  return (
    <AppShell padding="md" header={{ height: { base: 112, sm: 60 } }}>
      <AppShell.Header
        style={{
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>
        <AppMain />
      </AppShell.Main>
    </AppShell>
  );
}
