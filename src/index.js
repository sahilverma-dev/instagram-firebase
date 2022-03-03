import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import "./index.css";

ReactDOM.render(
  <AuthProvider>
    <AnimatePresence>
      <App />
    </AnimatePresence>
  </AuthProvider>,
  document.getElementById("root")
);
