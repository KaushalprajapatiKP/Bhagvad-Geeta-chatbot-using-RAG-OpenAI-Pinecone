import React from "react";
import ReactDOM from "react-dom/client";
import ChatApp from "./ChatApp"; // Ensure the correct path
import "./styles/index.css"; // Ensure this file exists and has necessary styles

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>
);

