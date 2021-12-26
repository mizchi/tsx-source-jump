import { defineConfig } from "vite";
export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: "src/mod.ts",
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "cjs") {
          return `index.cjs`;
        }
        if (format === "es") {
          return `index.es.js`;
        }
        return "";
      },
    },
  },
});
