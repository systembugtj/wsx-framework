module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
        extraFileExtensions: [".wsx"],
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],
    },
    globals: {
        NodeListOf: "readonly",
        h: "readonly",
        Fragment: "readonly",
    },
    overrides: [
        {
            files: ["*.wsx"],
            rules: {
                "@typescript-eslint/no-unused-vars": "warn",
            },
        },
    ],
    ignorePatterns: ["dist/", "node_modules/"],
};
