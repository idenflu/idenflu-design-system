import * as React from "react";
import { createRoot } from "react-dom/client";
import "@idenflu/ui-react/styles.css";
import "./playground.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
