/* eslint-disable @typescript-eslint/no-namespace */
/**
 * JSX 入口点
 * 专门为 jsxImportSource 机制提供 JSX 工厂函数
 */

// 导入 JSX 工厂函数
import { h, Fragment } from "./jsx-factory";

// 全局 JSX 命名空间声明 - 这是 TypeScript jsxImportSource 机制的关键
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // 标准HTML元素
            div: HTMLAttributes<HTMLDivElement>;
            button: HTMLAttributes<HTMLButtonElement>;
            a: HTMLAttributes<HTMLAnchorElement>;
            span: HTMLAttributes<HTMLSpanElement>;
            input: HTMLAttributes<HTMLInputElement>;
            p: HTMLAttributes<HTMLParagraphElement>;
            h1: HTMLAttributes<HTMLHeadingElement>;
            h2: HTMLAttributes<HTMLHeadingElement>;
            h3: HTMLAttributes<HTMLHeadingElement>;
            ul: HTMLAttributes<HTMLUListElement>;
            li: HTMLAttributes<HTMLLIElement>;
            section: HTMLAttributes<HTMLElement>;
            // Web Components 元素
            slot: HTMLAttributes<HTMLSlotElement>;
        }

        interface HTMLAttributes<T extends HTMLElement = HTMLElement> {
            // 基础属性
            className?: string;
            class?: string;
            id?: string;
            style?: string;
            disabled?: boolean;
            title?: string;
            type?: string;
            value?: string;
            placeholder?: string;
            src?: string;
            alt?: string;
            href?: string | null;
            target?: string;
            rel?: string;
            download?: string;

            // Ref callback with proper typing
            ref?: (element: T) => void;

            // Data attributes
            [dataAttr: `data-${string}`]: string;

            // Event handlers
            onClick?: (event: Event) => void;
            onInput?: (event: Event) => void;
            onChange?: (event: Event) => void;
            onMouseOver?: (event: Event) => void;
            onMouseOut?: (event: Event) => void;
            onFocus?: (event: Event) => void;
            onBlur?: (event: Event) => void;
            onMouseDown?: (event: MouseEvent) => void;
            onKeyDown?: (event: KeyboardEvent) => void;

            // 允许任意属性
            [key: string]: unknown;
        }

        // 核心 JSX 接口
        type Element = HTMLElement;

        interface ElementClass {
            render(): Element;
        }

        interface ElementAttributesProperty {
            props: object;
        }

        interface ElementChildrenAttribute {
            children: object;
        }

        type LibraryManagedAttributes<_C, P> = P;
    }
}

// 导出 JSX 工厂函数
export { h, Fragment };
