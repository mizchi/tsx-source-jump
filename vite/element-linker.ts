import type { SourceLinkerOptions } from "../types";
import type { Plugin } from "vite";

import ts from "typescript";
import { jsxTransformerFactory } from "../lib/transformers";

const printer = ts.createPrinter();
export function tsxElementLinker(opts: SourceLinkerOptions) {
  return {
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.endsWith(".tsx")) {
        const source = ts.createSourceFile(
          id,
          code,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX
        );
        const out = ts.transform(source, [jsxTransformerFactory(opts)]);
        const printed = printer.printNode(
          ts.EmitHint.SourceFile,
          out.transformed[0],
          out.transformed[0]
        );
        return printed;
      }
    },
  } as Plugin;
}
