# tsx-source-jump

Jump to source code of created elements on vscode.

![](https://gyazo.com/c37613f60f53d43e9701ebc6d4c97922.gif)

- TypeScript Transformer
- `vite`'s Plugin
- Runtime Overlay

## How to use

### Install

```bash
yarn add tsx-element-linker
```

### Vite

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tsxSourceJump } from "tsx-source-jump/vite";

export default defineConfig({
  plugins: [
    tsxElementLinker({
      // your projectRoot
      projectRoot: __dirname + "/",
      // rewriting element target
      target: [/^[a-z]+$/],
    }),
    react(),
    embedSource(),
  ],
});
```

Mount UI.

```tsx
// entrypoint
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { OverlayPortal } from "tsx-source-jump/runtime";

ReactDOM.render(
  <React.StrictMode>
    <OverlayPortal />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

- Enter your vite app (`http://localhost:3000`)
- Press `Shift` and move cursor to element you want to open
- Click element path

### with charkra-ui / react-native-elements ...

`tsx-source-jump` adds `data-source-path="..."` for `target` options.

Targeted elements should pass `data-source-*` to raw elements.

```ts
// vite.config.ts
tsxElementLinker({
  projectRoot: __dirname + "/",
  target: [
    // default target: div, main, span...
    /^[a-z]+$/,
    // for chakra
    /^(Box|Flex|Center|Container|Grid|SimpleGrid|Stack|Wrap|Button|Link|Icon|Image)$/,
  ],
});
```

## How it works

`tsx-source-jump/vite`'s typescript transformer adds `data-source-*` as props by `target: RegExp[]` in `.tsx`.

```tsx
// from
<div>
  xxx
</div>

// to
<div data-source-path="..." data-source-display-name="...">
  xxx
</div>
```

## TODO

- [ ] Support other framework
- [ ] Support swc, babel
- [ ] Lightweight runtime (preact)
- [ ] Inline Code Editor

## LICENSE

MIT
