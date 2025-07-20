/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/packages"],
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/packages/*/dist/",
        "<rootDir>/packages/eslint-plugin/__tests__/setup.ts",
        "<rootDir>/packages/vite-plugin/",
        "<rootDir>/packages/examples/**", // Exclude examples from Jest since it will use Vitest
    ],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: {
                    jsx: "react-jsx",
                    jsxImportSource: "@systembug/wsx-core",
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    isolatedModules: true,
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                    moduleResolution: "node",
                    target: "es2020",
                    module: "esnext",
                    strict: true,
                },
            },
        ],
    },
    moduleNameMapper: {
        "^@systembug/wsx-core$": "<rootDir>/packages/core/src",
        "^@systembug/wsx-vite-plugin$": "<rootDir>/packages/vite-plugin/src",
        "^@systembug/wsx-eslint-plugin$": "<rootDir>/packages/eslint-plugin/src",
        "^@systembug/wsx-components$": "<rootDir>/packages/components/src",
        "\\.css\\?inline$": "<rootDir>/test/__mocks__/styleMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
    collectCoverageFrom: [
        "packages/*/src/**/*.{ts,tsx}",
        "!packages/*/src/**/*.d.ts",
        "!packages/*/src/**/*.test.{ts,tsx}",
        "!packages/*/src/**/__tests__/**",
        "!packages/examples/**", // Exclude examples from coverage
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "lcov", "html", "json"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
