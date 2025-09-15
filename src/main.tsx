import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { ThemeProvider } from "./store/themeStore";
import { Analytics } from "@vercel/analytics/next";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Analytics />
    <MantineProvider theme={theme}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MantineProvider>
  </React.StrictMode>,
);
