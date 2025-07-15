/* eslint-disable no-console */
/**
 * Vite Plugin for WSX (Web Component JSX)
 *
 * 专门处理.wsx文件：
 * - 自动添加JSX pragma
 * - 支持TypeScript编译
 * - 完全隔离，不影响主项目React配置
 */

import type { Plugin } from 'vite';

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
 * 计算到 jsx-factory 的相对路径
 */
function getRelativePathToJSXFactory(filePath: string): string {
  const isInBase = filePath.includes('/base/');
  const isInComponents = filePath.includes('/components/');
  const isInPlugin = filePath.includes('/plugin/');
  const isInTextColorTool = filePath.includes('/TextColorTool/');

  if (isInBase) {
    return './jsx-factory';
  } else if (isInComponents) {
    return '../base/jsx-factory';
  } else if (isInPlugin) {
    return '../base/jsx-factory';
  } else if (isInTextColorTool) {
    return '../base/jsx-factory';
  } else {
    // 默认从 editorjs-tools 下的任何工具
    return './base/jsx-factory';
  }
}

/**
 * WSX Vite插件
 */
export function vitePluginWSX(options: WSXPluginOptions = {}): Plugin {
  const {
    jsxFactory = 'h',
    jsxFragment = 'Fragment',
    debug = false,
    extensions = ['.wsx'],
  } = options;

  return {
    name: 'vite-plugin-wsx',
    enforce: 'pre', // 确保在 React 插件之前执行

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

      // 1. 自动注入必要的导入
      const hasJSXFactoryImport =
        code.includes('from "../base/jsx-factory"') ||
        code.includes('from "./jsx-factory"') ||
        code.includes('from "../jsx-factory"');

      if (!hasJSXFactoryImport && (code.includes('<') || code.includes('Fragment'))) {
        // 计算相对路径到 jsx-factory
        const relativePath = getRelativePathToJSXFactory(id);
        const importStatement = `import { ${jsxFactory}, ${jsxFragment} } from "${relativePath}";\n`;
        transformedCode = importStatement + transformedCode;

        if (debug) {
          console.log(`[WSX Plugin] Added JSX factory import to: ${id}`);
        }
      }

      // 2. 添加JSX pragma - 不添加，让esbuild使用jsxFactory config
      // JSX transformation will be handled by esbuild with our custom config

      // 3. 使用 esbuild 进行 JSX 转换
      const { transform } = await import('esbuild');

      try {
        const result = await transform(transformedCode, {
          loader: 'tsx',
          jsx: 'transform',
          jsxFactory: jsxFactory,
          jsxFragment: jsxFragment,
          target: 'es2020',
          format: 'esm',
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
        console.log(`[WSX Plugin] Build started with extensions: ${extensions.join(', ')}`);
        console.log(`[WSX Plugin] JSX Factory: ${jsxFactory}, Fragment: ${jsxFragment}`);
      }
    },
  };
}

export default vitePluginWSX;
