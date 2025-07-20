import { defineConfig } from "vitest/config";
import { wsx } from "@systembug/wsx-vite-plugin";
import path from "path";

export default defineConfig({
    plugins: [wsx()],
    test: {
        globals: true,
        environment: "happy-dom",
        setupFiles: ["./test/setup.ts"],
        include: ["src/**/*.test.ts", "src/**/*.test.tsx", "test/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{ts,tsx,wsx}"],
            exclude: ["src/**/*.d.ts", "src/**/*.test.{ts,tsx}", "src/main.ts"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@systembug/wsx-core": path.resolve(__dirname, "../core/src"),
        },
    },
    esbuild: {
        jsx: "transform",
        jsxFactory: "h",
        jsxFragment: "Fragment",
        jsxInject: `import { h, Fragment } from '@systembug/wsx-core'`,
        target: "es2020",
    },
});
