import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";
import { OverlayPortal } from "../src/runtime/Overlay";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <OverlayPortal />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
