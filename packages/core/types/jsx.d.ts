/**
 * JSX 专用类型声明文件
 * 为 jsxImportSource 机制提供类型支持
 */

// 导入全局 JSX 类型声明
import "./wsx-types";

// 导出 JSX 工厂函数
export { h, Fragment } from "./wsx-types";

// JSX namespace declaration for TypeScript
export namespace JSX {
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
