import type { Plugin } from "vite";

export function embedSource() {
  return {
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        const escaped = encodeURIComponent(code);
        return (
          code +
          `\n//@ts-ignore\n(globalThis.__files||={})['${id}'] = decodeURIComponent("${escaped}");`
        );
      }
    },
  } as Plugin;
}
