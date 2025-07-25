/**
 * WSX Framework 类型声明文件
 *
 * 为WSX组件和模块提供TypeScript类型支持
 */

// WSX组件模块声明
declare module "*.wsx" {
    import { WebComponent } from "@wsxjs/wsx-core";
    const Component: typeof WebComponent;
    export default Component;
}

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

// 全局类型扩展 - 预留给将来添加全局类型
// declare global {
//     interface Window {
//         // 可以在这里添加全局window属性
//         wsxDebug?: boolean;
//     }
//
//     interface HTMLElement {
//         // 可以在这里添加HTMLElement扩展
//         wsxComponent?: WebComponent;
//     }
// }

export {};
