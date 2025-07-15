/**
 * WSX TypeScript 声明文件
 * 支持 CSS inline 导入和其他 WSX 特性
 */

// CSS Inline 导入支持
declare module '*.css?inline' {
  const content: string;
  export default content;
}

// 标准 CSS 模块支持
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// WSX 文件支持 - 将 .wsx 文件视为 TypeScript 模块
declare module '*.wsx' {
  const Component: any;
  export default Component;
}

// JSX 全局类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface Element extends HTMLElement {}

    interface ElementClass {
      render(): Element;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    type LibraryManagedAttributes<C, P> = P;
  }
}

// JSX 工厂函数类型
declare function h(
  type: string | Function,
  props?: Record<string, any> | null,
  ...children: any[]
): HTMLElement;

declare const Fragment: symbol;

export { h, Fragment };
