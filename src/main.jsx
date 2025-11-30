import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('main.jsx: booting app');
const root = createRoot(document.getElementById("root"));
root.render(<App />);
