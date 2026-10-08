import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/json-formatter/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
