import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "netlify",
    plugins: ["src/nitro-plugin.ts"]
  }
});
