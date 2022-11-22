import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      web3: "web3/dist/web3.min.js",
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      // input: {
      //   popup: resolve(__dirname, "popup.html"),
      // },
      input: [
        "popup.html",
        "src/scripts/content.ts",
        "src/scripts/background.ts",
        "src/scripts/inject.ts",
      ],
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
