import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // 更新頻度の異なる主要ライブラリを分け、再訪時のブラウザキャッシュを再利用しやすくする。
          if (id.includes("@mantine")) return "mantine";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/")
          ) {
            return "react";
          }
          if (id.includes("i18next")) return "i18n";

          return "vendor";
        },
      },
    },
  },
});
