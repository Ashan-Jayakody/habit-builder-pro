import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeColorProvider } from "./hooks/use-theme-color.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeColorProvider>
    <App />
  </ThemeColorProvider>
);
