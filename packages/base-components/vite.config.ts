import { defineConfig } from "vite";
import { wsx } from "@systembug/wsx-vite-plugin";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "WSXBaseComponents",
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
    },
    plugins: [
        wsx({
            debug: false,
            jsxFactory: "jsx",
            jsxFragment: "Fragment",
        }),
    ],
});
