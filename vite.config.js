import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CLOUD_NAME = "xneryc39";
const API_KEY = "676182881972536";
const API_SECRET = "vnuQDRWJTaqVhL8Htezb2gQAXXA";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https://i.ibb.co https://placehold.co https://imgbb.com https://via.placeholder.com https://*.stripe.com https://res.cloudinary.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' http://localhost:3001 http://192.168.0.14:3001 https://api.cloudinary.com https://res.cloudinary.com; " +
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com;",
    },
    proxy: {
      "/cloudinary-admin": {
        target: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudinary-admin/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const encoded = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
            proxyReq.setHeader("Authorization", `Basic ${encoded}`);
          });
        },
      },
    },
  },
});
