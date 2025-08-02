import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/slack': {
        target: 'https://hooks.slack.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/slack/, ''),
      },
      '/api/discord': {
        target: 'https://discord.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/discord/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
