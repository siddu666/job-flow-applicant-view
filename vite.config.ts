
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// @ts-ignore
import { lovableTagger } from 'lovable-tagger'

// @ts-ignore
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
      lovableTagger({
        appName: "Justera Group Careers",
        appIcon: "https://placeholder.svg",
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
}))
