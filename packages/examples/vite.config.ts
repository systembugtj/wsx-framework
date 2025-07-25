import { defineConfig } from "vite";
import { wsx } from "@wsxjs/wsx-vite-plugin";
import UnoCSS from "unocss/vite";

export default defineConfig({
    // Set base path for GitHub Pages deployment
    base:
        process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES === "true"
            ? process.env.CUSTOM_DOMAIN === "true"
                ? "/"
                : "/wsx-framework/"
            : "/",
    plugins: [
        UnoCSS(),
        wsx({
            debug: false,
            jsxFactory: "h",
            jsxFragment: "Fragment",
        }),
    ],
    build: {
        outDir: "dist",
        sourcemap: process.env.NODE_ENV !== "production", // No source maps in production
    },
    server: {
        sourcemap: true, // Enable source maps for dev server
    },
    // TODO: Suport HMR for WSX components
    // Uncomment the following lines if you need to resolve the wsx-core package
    // resolve: {
    //     alias: {
    //         "@wsxjs/wsx-core": new URL("../core/src/index.ts", import.meta.url).pathname,
    //     },
    // },
});
