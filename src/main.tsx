import "@fontsource/creepster";
import "@fontsource/special-elite";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const Display = lazy(() => import("./display/Display.tsx"));
const Join = lazy(() => import("./join/Join.tsx"));

const isJoin = location.pathname.startsWith("/join");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>{isJoin ? <Join /> : <Display />}</Suspense>
  </StrictMode>,
);
