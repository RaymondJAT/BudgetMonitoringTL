import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // BMS
    proxy: {
      "/api5012": {
        target: "http://192.168.40.37:5012",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api5012/, ""),
      },
      // GBOOKS
      "/api5001": {
        target: "http://192.168.40.37:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api5001/, ""),
      },
    },
  },
});
