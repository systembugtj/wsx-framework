/* eslint-disable no-console */
/**
 * Vite Plugin for WSX (Web Component JSX)
 *
 * 专门处理.wsx文件：
 * - 自动添加JSX pragma
 * - 支持TypeScript编译
 * - 完全隔离，不影响主项目React配置
 */

import type { Plugin } from "vite";
import { transform } from "esbuild";

export interface WSXPluginOptions {
    /**
     * JSX工厂函数名
     * @default 'h'
     */
    jsxFactory?: string;

    /**
     * JSX Fragment函数名
     * @default 'Fragment'
     */
    jsxFragment?: string;

    /**
     * 是否启用调试日志
     * @default false
     */
    debug?: boolean;

    /**
     * 文件扩展名
     * @default ['.wsx']
     */
    extensions?: string[];
}

/**
 * 获取 JSX 工厂函数的导入路径
 */
function getJSXFactoryImportPath(_options: WSXPluginOptions): string {
    // 使用 @systembug/wsx-core 包中的 JSX 工厂
    return "@systembug/wsx-core";
}

/**
 * WSX Vite插件
 */
export function vitePluginWSX(options: WSXPluginOptions = {}): Plugin {
    const {
        jsxFactory = "h",
        jsxFragment = "Fragment",
        debug = false,
        extensions = [".wsx"],
    } = options;

    return {
        name: "vite-plugin-wsx",
        enforce: "pre", // 确保在 React 插件之前执行

        // 处理 .wsx 文件加载
        load(id: string) {
            const isWSXFile = extensions.some((ext) => id.endsWith(ext));

            if (!isWSXFile) {
                return null;
            }

            if (debug) {
                console.log(`[WSX Plugin] Loading: ${id}`);
            }

            // 返回 null 让 Vite 继续处理文件
            return null;
        },

        // 在transform阶段处理文件
        async transform(code: string, id: string) {
            // 检查是否是WSX文件
            const isWSXFile = extensions.some((ext) => id.endsWith(ext));

            if (!isWSXFile) {
                return null;
            }

            if (debug) {
                console.log(`[WSX Plugin] Processing: ${id}`);
            }

            let transformedCode = code;

            // 1. 检查是否已经有JSX工厂导入
            const hasWSXCoreImport = code.includes('from "@systembug/wsx-core"');
            // 更精确的检测：使用正则表达式检查 JSX 工厂函数是否在导入中
            const hasJSXInImport =
                hasWSXCoreImport &&
                (new RegExp(`[{,]\\s*${jsxFactory}\\s*[},]`).test(code) ||
                    new RegExp(`[{,]\\s*${jsxFragment}\\s*[},]`).test(code));

            // 调试信息
            if (debug) {
                console.log(`[WSX Plugin] Checking JSX imports for: ${id}`);
                console.log(`  - hasWSXCoreImport: ${hasWSXCoreImport}`);
                console.log(`  - hasJSXInImport: ${hasJSXInImport}`);
                console.log(`  - has < character: ${code.includes("<")}`);
                console.log(`  - has Fragment: ${code.includes("Fragment")}`);
            }

            // 如果有JSX语法但没有JSX工厂导入，则需要注入
            if ((code.includes("<") || code.includes("Fragment")) && !hasJSXInImport) {
                // 使用标准的包导入
                const importPath = getJSXFactoryImportPath(options);
                const importStatement = `import { ${jsxFactory}, ${jsxFragment} } from "${importPath}";\n`;
                transformedCode = importStatement + transformedCode;

                if (debug) {
                    console.log(`[WSX Plugin] Added JSX factory import to: ${id}`);
                }
            }

            // 2. 添加JSX pragma - 不添加，让esbuild使用jsxFactory config
            // JSX transformation will be handled by esbuild with our custom config

            // 3. 使用 esbuild 进行 JSX 转换

            try {
                const result = await transform(transformedCode, {
                    loader: "tsx",
                    jsx: "transform",
                    jsxFactory: jsxFactory,
                    jsxFragment: jsxFragment,
                    target: "es2020",
                    format: "esm",
                    // Esbuild supports decorators natively with tsx loader
                });

                if (debug) {
                    console.log(`[WSX Plugin] JSX transformed: ${id}`);
                }

                return {
                    code: result.code,
                    map: null,
                };
            } catch (error) {
                console.error(`[WSX Plugin] Transform error for ${id}:`, error);
                throw error;
            }
        },

        // We handle JSX transformation directly in the transform hook
        // No need to modify global esbuild config

        // 构建开始时的日志
        buildStart() {
            if (debug) {
                console.log(`[WSX Plugin] Build started with extensions: ${extensions.join(", ")}`);
                console.log(`[WSX Plugin] JSX Factory: ${jsxFactory}, Fragment: ${jsxFragment}`);
            }
        },
    };
}

export default vitePluginWSX;
