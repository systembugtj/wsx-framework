/**
 * ESLint Plugin for WSX (Web Components JSX) - TypeScript 版本
 *
 * 提供针对 WSX 框架的专用 ESLint 规则和配置
 * 注意：不包含 valid-jsx-pragma 规则，因为 Vite 插件已处理 JSX pragma
 */

import { renderMethodRequired } from "./rules/render-method-required";
import { noReactImports } from "./rules/no-react-imports";
import { webComponentNaming } from "./rules/web-component-naming";
import { recommendedConfig } from "./configs/recommended";
import { WSXPlugin } from "./types";

const plugin: WSXPlugin = {
    // 插件元信息
    meta: {
        name: "wsx-eslint-plugin",
        version: "1.0.0",
    },

    // 核心规则（移除 valid-jsx-pragma）
    rules: {
        "render-method-required": renderMethodRequired,
        "no-react-imports": noReactImports,
        "web-component-naming": webComponentNaming,
    },

    // 配置预设
    configs: {
        recommended: recommendedConfig,
    },
};

export default plugin;
