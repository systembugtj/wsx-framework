import { defineConfig } from "vite";
import { wsx } from "@systembug/wsx-vite-plugin";
import UnoCSS from "unocss/vite";

export default defineConfig({
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
        sourcemap: true, // Examples can keep source maps since it's not published
    },
    server: {
        sourcemap: true, // Enable source maps for dev server
    },
    // TODO: Suport HMR for WSX components
    // Uncomment the following lines if you need to resolve the wsx-core package
    // resolve: {
    //     alias: {
    //         "@systembug/wsx-core": new URL("../core/src/index.ts", import.meta.url).pathname,
    //     },
    // },
});
