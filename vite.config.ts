import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const guideUrl = new URL(env.VITE_GUIDE_API_URL ||
    "https://6aec88e1fc3b911e6fd54a2f.mockapi.io/api/v1/guide/information");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/remote-images/": {
          target: "https://images.unsplash.com",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/remote-images/, ""),
        },
        "/api/guide": {
          target: guideUrl.origin,
          changeOrigin: true,
          rewrite: () => guideUrl.pathname + guideUrl.search,
        },
      },
    },
  };
});
