import "@mantine/core/styles.css";
import { AppShell } from "@mantine/core";
import { AppHeader } from "./components/AppHeader";
import { AppMain } from "./components/AppMain";

export default function App() {
  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
