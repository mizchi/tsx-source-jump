import ts, { factory } from "typescript";
import { SourceLinkerOptions } from "./types.mjs";

function findOwnerComponent(node: ts.Node): ts.FunctionDeclaration | null {
  let cur = node;
  while (cur.parent) {
    if (ts.isFunctionDeclaration(cur)) return cur;
    if (ts.isSourceFile(cur)) return null;
    cur = cur.parent;
  }
  return null;
}

export function jsxTransformerFactory(opts: SourceLinkerOptions) {
  return (context: ts.TransformationContext) => {
    const __visitNode = (node: ts.Node): ts.Node => {
      const newNode = ts.visitEachChild(node, __visitNode, context);
      if (
        ts.isJsxOpeningElement(newNode) ||
        ts.isJsxSelfClosingElement(newNode)
      ) {
        return appendSourceMapAttribute(opts, newNode);
      }
      return newNode;
    };
    return (source: ts.SourceFile) => {
      return ts.factory.updateSourceFile(
        source,
        ts.visitNodes(source.statements, __visitNode)
      );
    };
  };
}

const defaultTarget = [/^[a-z]+$/];

function appendSourceMapAttribute(
  opts: SourceLinkerOptions,
  node: ts.JsxOpeningElement | ts.JsxSelfClosingElement
) {
  if (ts.isIdentifier(node.tagName)) {
    const tagName = node.tagName.getText();

    const target = opts.target ?? defaultTarget;
    if (!target.some((t) => t.test(tagName))) return node;

    const source = node.getSourceFile();
    const fileName = source.fileName;
    const position = ts.getLineAndCharacterOfPosition(
      source,
      node.getStart(source)
    );
    const factoryMethod =
      node.kind === ts.SyntaxKind.JsxOpeningElement
        ? factory.createJsxOpeningElement
        : factory.createJsxSelfClosingElement;
    const owner = findOwnerComponent(node);
    const displayText = `${fileName.replace(opts.projectRoot, "")}:${
      position.line + 1
    }:${position.character + 1}${owner ? ` | [${owner.name?.getText()}]` : ""}`;

    let inlineCode = null;
    if (opts.inlineCode) {
      inlineCode = node.getText();
      // inlineCode = source.getFullText().slice(node.getStart(), node.getEnd());
    }
    return factoryMethod(
      node.tagName,
      node.typeArguments,
      factory.updateJsxAttributes(node.attributes, [
        ...node.attributes.properties,
        factory.createJsxAttribute(
          factory.createIdentifier("data-source-path"),
          factory.createStringLiteral(
            `vscode://file${fileName}:${position.line + 1}:${
              position.character + 1
            }`
          )
        ),
        factory.createJsxAttribute(
          factory.createIdentifier("data-source-display-name"),
          factory.createStringLiteral(displayText)
        ),
        ...(inlineCode
          ? [
              factory.createJsxAttribute(
                factory.createIdentifier("data-source-code"),
                factory.createStringLiteral(encodeURIComponent(inlineCode))
              ),
            ]
          : []),
        // factory.createJsxAttribute(
        //   factory.createIdentifier("data-sourcemap"),
        //   factory.createStringLiteral(`${start}:${end}`)
        // ),
        // factory.createJsxAttribute(
        //   factory.createIdentifier("onClick"),
        //   factory.createJsxExpression(
        //     undefined,
        //     createClickHandler(
        //       fileName,
        //       start,
        //       end,
        //       position.line + 1,
        //       position.character + 1
        //     )
        //   )
        // ),
      ])
    );
  }
  return node;
}
