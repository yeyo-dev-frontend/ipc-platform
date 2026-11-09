import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const resource = (path) => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@ipc/image": resource("../frontend/src/components/atoms/image.jsx"),
      "@ipc/campus": resource(
        "../frontend/src/assets/images/studentLife/fachada.webp",
      ),
      "@ipc/font": resource(
        "../frontend/src/assets/fonts/Poppins-Regular.woff2",
      ),
      "@ipc/display": resource(
        "../frontend/src/assets/fonts/Rajdhani-Bold.woff2",
      ),
    },
  },
});
