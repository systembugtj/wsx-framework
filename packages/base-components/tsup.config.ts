/* eslint-disable no-console */
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: false, // Temporarily disabled until .wsx export issue is resolved
    clean: true,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: true,
    external: ["@systembug/wsx-core"],
    esbuildOptions: (options) => {
        options.jsx = "transform";
        options.jsxFactory = "jsx";
        options.jsxFragment = "Fragment";
        options.inject = ["./src/jsx-inject.ts"];
        // Configure .wsx files to be treated as TypeScript with JSX
        options.loader = {
            ...options.loader,
            ".wsx": "tsx",
        };
    },
    onSuccess: async () => {
        console.log("✅ Base components built successfully");
    },
});
