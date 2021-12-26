# tsx-source-jump

Jump from the HTML element to the source code of the generator.

![](https://i.gyazo.com/c003c81e7817d93367b26af8c64dcf65.gif)

## How it works

- Vite plugin to embed source location
- Overlay ui
- Open `vscode://file/...` to jump

## How to use

### Install

```bash
yarn add tsx-source-jump -D
```

### Vite

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tsxSourceJump } from "tsx-source-jump/vite";

export default defineConfig({
  plugins: [
    // DO NOT INCLUDE IN PRODUCTION
    ...(process.env.NODE_ENV !== "production"
      ? [
          tsxSourceJump({
            // your projectRoot
            projectRoot: __dirname + "/",
            // rewriting element target
            target: [/^[a-z]+$/],
          }),
        ]
      : []),
    react(),
  ],
});
```

(Current `tsx-source-jump` rewrites `.tsx` to `.tsx` to work with any ts compiler (tsc, esbuild, swc). It may causes performance problem)

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

### with primitive dom wrapper like charkra-ui / react-native-elements ...

`tsx-source-jump` adds `data-sj-path="..."` for `target` options.

```ts
// vite.config.ts
tsxSourceJump({
  projectRoot: __dirname + "/",
  target: [
    // default target: div, main, span...
    /^[a-z]+$/,
    // Additional targets for chakra-ui
    /^(Box|Flex|Center|Container|Grid|SimpleGrid|Stack|Wrap|Button|Link|Icon|Image)$/,
  ],
});
```

Targeted elements should pass `data-sj-*` to raw elements.

## How it works internal

`tsx-source-jump/vite`'s typescript transformer adds `data-sj-*` as props.

```tsx
// from
<div>
  xxx
</div>

// to
<div data-sj-path="..." data-source-display-name="...">
  xxx
</div>
```

In browser, `OverlayPortal` component catches `mouseover` events and overlay ui.

## TODO

- [ ] Support other framework
- [ ] Support swc, babel
- [ ] Lightweight runtime (preact)
- [ ] Inline Code Editor

## LICENSE

MIT
