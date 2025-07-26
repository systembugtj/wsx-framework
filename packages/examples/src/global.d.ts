/**
 * WSX Framework 类型声明文件
 *
 * 为WSX组件和模块提供TypeScript类型支持
 */

// Import core WSX types
/// <reference types="@wsxjs/wsx-core" />

// 图片模块声明
declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}

// CSS module declarations
declare module "*.css" {
    const styles: string;
    export default styles;
}

declare module "*.css?inline" {
    const styles: string;
    export default styles;
}

// WSX component module declarations
declare module "*.wsx" {
    import { WebComponent } from "@wsxjs/wsx-core";
    const component: typeof WebComponent;
    export default component;
}

// Testing library extensions
/// <reference types="@testing-library/jest-dom" />


// 全局类型扩展 - 预留给将来添加全局类型
declare global {
    namespace Vi {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interface Assertion<T = any> extends jest.Matchers<void, T> {}
        interface AsymmetricMatchersContaining extends jest.Expect {}
    }
}

export {};
