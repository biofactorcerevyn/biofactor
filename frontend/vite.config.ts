import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    visualizer({ filename: "dist/stats.html", gzipSize: true, open: false })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("@supabase") || id.includes("supabase")) return "vendor-supabase";
            if (id.includes("@radix-ui") || id.includes("lucide-react")) return "vendor-ui";
            if (id.includes("date-fns") || id.includes("lodash")) return "vendor-utils";
            return "vendor";
          }
        }
      }
    }
  }
}));
