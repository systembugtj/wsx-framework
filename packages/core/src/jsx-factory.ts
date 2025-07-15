/**
 * 纯原生JSX工厂 - 零依赖的EditorJS Web Component支持
 *
 * 特点：
 * - 完全独立，不依赖React或任何框架
 * - 支持标准JSX语法
 * - 原生DOM操作，性能优异
 * - 完全通用，适用于任何Web Components
 * - TypeScript类型安全
 */

// JSX命名空间声明 - 原生版本
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // 标准HTML元素
      div: HTMLAttributes;
      button: HTMLAttributes;
      section: HTMLAttributes;
      span: HTMLAttributes;
      input: HTMLAttributes;
      p: HTMLAttributes;
      h1: HTMLAttributes;
      h2: HTMLAttributes;
      h3: HTMLAttributes;
      ul: HTMLAttributes;
      li: HTMLAttributes;
      a: HTMLAttributes;
      // Web Components 元素
      slot: HTMLAttributes;
    }

    interface HTMLAttributes {
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
      href?: string;
      target?: string;

      // Ref callback
      ref?: (element: HTMLElement) => void;

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

      // 允许任意属性
      [key: string]: unknown;
    }
  }
}

// JSX子元素类型
export type JSXChildren =
  | string
  | number
  | HTMLElement
  | DocumentFragment
  | JSXChildren[]
  | null
  | undefined
  | boolean;

/**
 * 纯原生JSX工厂函数
 *
 * @param tag - HTML标签名或组件函数
 * @param props - 属性对象
 * @param children - 子元素
 * @returns DOM元素
 */
export function h(
  tag: string | ((...args: unknown[]) => HTMLElement),
  props: Record<string, unknown> | null = {},
  ...children: JSXChildren[]
): HTMLElement {
  // 处理组件函数
  if (typeof tag === 'function') {
    return tag(props, children);
  }

  // 创建DOM元素
  const element = document.createElement(tag);

  // 处理属性
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) {
        return;
      }

      // 处理ref回调
      if (key === 'ref' && typeof value === 'function') {
        (value as (element: HTMLElement) => void)(element);
      }
      // 处理className和class
      else if (key === 'className' || key === 'class') {
        element.className = value as string;
      }
      // 处理style
      else if (key === 'style' && typeof value === 'string') {
        element.setAttribute('style', value);
      }
      // 处理事件监听器
      else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value as EventListener);
      }
      // 处理布尔属性
      else if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
        }
      }
      // 处理其他属性
      else {
        element.setAttribute(key, String(value));
      }
    });
  }

  // 处理子元素
  const flatChildren = flattenChildren(children);
  flatChildren.forEach((child) => {
    if (child === null || child === undefined || child === false) {
      return;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child instanceof DocumentFragment) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * 扁平化子元素数组
 */
function flattenChildren(
  children: JSXChildren[]
): (string | number | HTMLElement | DocumentFragment | boolean | null | undefined)[] {
  const result: (string | number | HTMLElement | DocumentFragment | boolean | null | undefined)[] =
    [];

  for (const child of children) {
    if (child === null || child === undefined || child === false) {
      continue;
    } else if (Array.isArray(child)) {
      result.push(...flattenChildren(child));
    } else {
      result.push(child);
    }
  }

  return result;
}

/**
 * JSX Fragment支持 - 用于包装多个子元素
 */
export function Fragment(_props: unknown, children: JSXChildren[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const flatChildren = flattenChildren(children);

  flatChildren.forEach((child) => {
    if (child === null || child === undefined || child === false) {
      return;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      fragment.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof HTMLElement) {
      fragment.appendChild(child);
    } else if (child instanceof DocumentFragment) {
      fragment.appendChild(child);
    }
  });

  return fragment;
}

// 默认导出JSX工厂函数
export default h;
