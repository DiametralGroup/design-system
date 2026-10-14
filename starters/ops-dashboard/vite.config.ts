import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The package is linked from ../.. (file:), which has its own node_modules:
  // one copy of each library the app and the package both import. An npm
  // install from the registry dedupes these by itself.
  resolve: { dedupe: ["react", "react-dom", "recharts", "@phosphor-icons/react"] },
})
