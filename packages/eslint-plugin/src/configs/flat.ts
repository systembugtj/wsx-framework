/**
 * ESLint Plugin WSX - Flat Config for ESLint 9+
 *
 * Modern flat config format for WSX framework
 */

import type { Linter } from "eslint";

export const flatConfig: Linter.FlatConfig = {
    name: "wsx/recommended",
    files: ["**/*.tsx", "**/*.jsx"],
    languageOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            jsxPragma: "h",
            jsxFragmentName: "Fragment",
        },
        globals: {
            // Browser environment
            window: "readonly",
            document: "readonly",
            console: "readonly",

            // Node.js environment
            process: "readonly",
            Buffer: "readonly",
            __dirname: "readonly",
            __filename: "readonly",
            global: "readonly",
            module: "readonly",
            require: "readonly",
            exports: "readonly",

            // Web Components API
            HTMLElement: "readonly",
            customElements: "readonly",
            CustomEvent: "readonly",
            ShadowRoot: "readonly",
            HTMLSlotElement: "readonly",
            CSSStyleSheet: "readonly",

            // WSX specific
            h: "readonly",
            Fragment: "readonly",
        },
    },
    plugins: {
        wsx: {
            rules: {
                "render-method-required": {},
                "no-react-imports": {},
                "web-component-naming": {},
            },
        },
    },
    rules: {
        // WSX specific rules
        "wsx/render-method-required": "error",
        "wsx/no-react-imports": "error",
        "wsx/web-component-naming": "warn",

        // TypeScript rules (recommended)
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-non-null-assertion": "warn",

        // General rules
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "error",
        "no-unused-vars": "off", // Use TypeScript version
        "no-undef": "off", // TypeScript handles this
        "prefer-const": "error",
        "no-var": "error",
        "no-duplicate-imports": "error",
        "no-trailing-spaces": "error",
        "eol-last": "error",
        "comma-dangle": ["error", "always-multiline"],
        semi: ["error", "always"],
        quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    },
    settings: {
        // No React settings needed
    },
};

// Helper function to create a flat config with the plugin
export function createFlatConfig(plugin: any): Linter.FlatConfig {
    return {
        ...flatConfig,
        plugins: {
            wsx: plugin,
        },
    };
}
