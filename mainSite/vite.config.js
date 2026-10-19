import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: {
      host: "69.62.107.249",
      port: 3000,
      protocol: "ws",
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "69.62.107.249",
      "development.gdggug.com",
      "gdggug.com",
    ],
  },
});
