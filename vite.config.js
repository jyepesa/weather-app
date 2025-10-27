import { defineConfig } from "vite";
import { resolve } from "path";

const repoName = "weather-app";

export default defineConfig({
  base: `/${repoName}/`,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        city: resolve(__dirname, "city.html"),
      },
    },
  },
});
