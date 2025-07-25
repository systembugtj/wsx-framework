import { defineConfig } from "vite";
import { wsx } from "@systembug/wsx-vite-plugin";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "WSXRouter",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
        },
        rollupOptions: {
            external: ["@systembug/wsx-core"],
            output: {
                globals: {
                    "@systembug/wsx-core": "WSXCore",
                },
            },
        },
        cssCodeSplit: false, // 禁用CSS代码分割，确保CSS内联到JS中
        sourcemap: process.env.NODE_ENV === "development", // 只在开发环境生成 source maps
    },
    plugins: [
        wsx({
            debug: false,
            jsxFactory: "jsx",
            jsxFragment: "Fragment",
        }),
    ],
});
