import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tanstackStart({ srcDirectory: "app" }),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./app") },
  },
  optimizeDeps: {
    include: [
      "use-sync-external-store/shim/with-selector",
      "use-sync-external-store/shim",
    ],
  },
});
