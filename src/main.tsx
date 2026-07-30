import { MantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./i18n";
import { ThemeProvider } from "./store/themeStore";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Analytics />
    <MantineProvider theme={theme}>
      <ThemeProvider>
        <App />
        <Toaster position="bottom-right" richColors closeButton />
      </ThemeProvider>
    </MantineProvider>
  </React.StrictMode>,
);
