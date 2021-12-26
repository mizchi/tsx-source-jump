import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";
import { SourceJumpOverlayPortal } from "../";

ReactDOM.render(
  <React.StrictMode>
    <SourceJumpOverlayPortal />
    <ChakraProvider resetCSS>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
