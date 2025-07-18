/**
 * WSX TypeScript 声明文件
 * 支持 CSS inline 导入和其他 WSX 特性
 */

// CSS Inline 导入支持
declare module "*.css?inline" {
    const content: string;
    export default content;
}

// 标准 CSS 模块支持
declare module "*.css" {
    const classes: { [key: string]: string };
    export default classes;
}

// WSX 文件支持 - 将 .wsx 文件视为 TypeScript 模块
declare module "*.wsx" {
    const Component: unknown;
    export default Component;
}

// JSX 工厂函数类型
declare function h(
    type: string | ((...args: unknown[]) => unknown),
    props?: Record<string, unknown> | null,
    ...children: unknown[]
): HTMLElement;

declare const Fragment: symbol;

// Global JSX namespace declaration
declare global {
    namespace JSX {
        type Element = HTMLElement;

        interface IntrinsicElements {
            // HTML elements
            [elemName: string]: object;
        }

        interface ElementAttributesProperty {
            props: object;
        }

        interface ElementChildrenAttribute {
            children: object;
        }
    }
}

export { h, Fragment };
