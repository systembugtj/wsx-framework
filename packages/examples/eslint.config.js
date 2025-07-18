import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import wsxPlugin from "@systembug/eslint-plugin-wsx";
import globals from "globals";

export default [
    {
        ignores: ["**/dist/", "**/node_modules/"],
    },

    js.configs.recommended,

    {
        files: ["**/*.{ts,tsx,js,jsx,wsx}"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                jsxPragma: "h",
                jsxFragmentName: "Fragment",
                extraFileExtensions: [".wsx"],
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                NodeListOf: "readonly",
                h: "readonly",
                Fragment: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            wsx: wsxPlugin,
        },
        rules: {
            ...typescript.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            // WSX plugin rules
            "wsx/render-method-required": "error",
            "wsx/no-react-imports": "error",
            "wsx/web-component-naming": "warn",
            "no-undef": "off", // TypeScript handles this
        },
    },

    {
        files: ["**/*.wsx"],
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
