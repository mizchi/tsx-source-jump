import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tsxSourceJump } from "..";
import { embedSource } from "../src/vite/embed-source";

export default defineConfig({
  plugins: [
    tsxSourceJump({
      projectRoot: __dirname + "/",
      target: [
        /^[a-z]+$/,
        // for chakra-ui
        /^(Box|Flex|Center|Container|Grid|SimpleGrid|Stack|Wrap|Button|Link|Icon|Image)$/,
      ],
    }),
    react(),
    embedSource(),
  ],
});
