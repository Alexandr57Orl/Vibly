import { I18nProvider } from "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { ExplorePage } from "./pages/ExplorePage";
import "./styles.css";
import "./refresh.css";
import "./workspace.css";
import "./theme.css";
import "./community.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider><ExplorePage /></I18nProvider>
  </React.StrictMode>,
);
