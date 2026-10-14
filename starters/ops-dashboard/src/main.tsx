import mark from "@diametral/design-system/assets/logo/diametral-mark.svg"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import "./index.css"
import { App } from "./App"
import { preloadPages } from "./pages"

document.querySelector<HTMLLinkElement>("link[rel=icon]")!.href = mark

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

addEventListener("load", preloadPages)
