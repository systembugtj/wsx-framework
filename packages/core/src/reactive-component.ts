/**
 * 响应式 WSX Web Component
 *
 * 扩展基础 WebComponent，提供响应式状态支持
 * 遵循 WSX 理念：可选使用，不破坏现有组件
 */

import { WebComponent, type WebComponentConfig } from "./web-component";
import { reactive, createState, reactiveWithDebug } from "./utils/reactive";

/**
 * 响应式 WebComponent 配置
 */
export interface ReactiveWebComponentConfig extends WebComponentConfig {
    /** 是否启用响应式调试模式 */
    debug?: boolean;
    /** 是否启用自动焦点保持 */
    preserveFocus?: boolean;
}

/**
 * 响应式 WebComponent 基类
 *
 * 提供响应式状态管理能力，同时保持与标准 WebComponent 的完全兼容
 */
export abstract class ReactiveWebComponent extends WebComponent {
    private _isDebugEnabled: boolean = false;
    private _preserveFocus: boolean = true;
    private _reactiveStates = new Map<string, any>();

    constructor(config: ReactiveWebComponentConfig = {}) {
        super(config);

        this._isDebugEnabled = config.debug ?? false;
        this._preserveFocus = config.preserveFocus ?? true;
    }

    /**
     * 创建响应式对象
     *
     * @param obj 要变为响应式的对象
     * @param debugName 调试名称（可选）
     * @returns 响应式代理对象
     */
    protected reactive<T extends object>(obj: T, debugName?: string): T {
        const reactiveFn = this._isDebugEnabled ? reactiveWithDebug : reactive;
        const name = debugName || `${this.constructor.name}.reactive`;

        return this._isDebugEnabled
            ? reactiveFn(obj, () => this.scheduleRerender(), name)
            : reactiveFn(obj, () => this.scheduleRerender());
    }

    /**
     * 创建响应式状态
     *
     * @param key 状态标识符
     * @param initialValue 初始值
     * @returns [getter, setter] 元组
     */
    protected useState<T>(
        key: string,
        initialValue: T
    ): [() => T, (value: T | ((prev: T) => T)) => void] {
        if (!this._reactiveStates.has(key)) {
            const [getter, setter] = createState(initialValue, () => this.scheduleRerender());
            this._reactiveStates.set(key, { getter, setter });
        }

        const state = this._reactiveStates.get(key);
        return [state.getter, state.setter];
    }

    /**
     * 调度重渲染
     * 这个方法被响应式系统调用，开发者通常不需要直接调用
     */
    protected scheduleRerender(): void {
        // 确保组件已连接到 DOM
        if (this.connected) {
            this.rerender();
        }
    }

    /**
     * 重写 rerender 方法以支持焦点保持
     */
    protected rerender(): void {
        if (!this.connected) {
            return;
        }

        let focusData: any = null;

        // 保存焦点状态（如果启用）
        if (this._preserveFocus) {
            const activeElement = this.shadowRoot.activeElement;
            focusData = this.saveFocusState(activeElement);
        }

        // 调用父类的重渲染逻辑
        super.rerender();

        // 恢复焦点状态（如果启用）- 立即同步执行避免闪烁
        if (this._preserveFocus && focusData) {
            this.restoreFocusState(focusData);
        }
    }

    /**
     * 保存焦点状态
     */
    private saveFocusState(activeElement: Element | null): any {
        if (!activeElement) {
            return null;
        }

        // 只保存可编辑元素的状态
        const focusData: any = {
            tagName: activeElement.tagName.toLowerCase(),
            className: activeElement.className,
        };

        // 保存选择/光标位置
        if (activeElement.hasAttribute("contenteditable")) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                focusData.selectionStart = range.startOffset;
                focusData.selectionEnd = range.endOffset;
            }
        }

        // 保存输入/选择元素的状态
        if (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLSelectElement
        ) {
            focusData.value = activeElement.value;
            if ("selectionStart" in activeElement) {
                focusData.selectionStart = activeElement.selectionStart;
                focusData.selectionEnd = activeElement.selectionEnd;
            }
        }

        return focusData;
    }

    /**
     * 恢复焦点状态
     */
    private restoreFocusState(focusData: any): void {
        if (!focusData) return;

        try {
            // 查找要恢复焦点的元素
            let targetElement: Element | null = null;

            // 首先尝试通过类名查找（最具体）
            if (focusData.className) {
                targetElement = this.shadowRoot.querySelector(
                    `.${focusData.className.split(" ")[0]}`
                );
            }

            // 备用方案：通过标签名查找
            if (!targetElement) {
                targetElement = this.shadowRoot.querySelector(focusData.tagName);
            }

            if (targetElement) {
                // 恢复焦点 - 防止页面滚动
                (targetElement as HTMLElement).focus({ preventScroll: true });

                // 恢复选择/光标位置
                if (focusData.selectionStart !== undefined) {
                    if (targetElement instanceof HTMLInputElement) {
                        targetElement.setSelectionRange(
                            focusData.selectionStart,
                            focusData.selectionEnd
                        );
                    } else if (targetElement instanceof HTMLSelectElement) {
                        targetElement.value = focusData.value;
                    } else if (targetElement.hasAttribute("contenteditable")) {
                        this.setCursorPosition(targetElement, focusData.selectionStart);
                    }
                }
            }
        } catch {
            // 静默处理焦点恢复失败，不应该影响正常渲染
        }
    }

    /**
     * 设置光标位置
     */
    private setCursorPosition(element: Element, position: number): void {
        try {
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                const textNode = element.childNodes[0];
                if (textNode) {
                    const maxPos = Math.min(position, textNode.textContent?.length || 0);
                    range.setStart(textNode, maxPos);
                    range.setEnd(textNode, maxPos);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        } catch {
            // 静默处理，焦点恢复失败不应该阻止渲染
        }
    }

    /**
     * 获取所有响应式状态的快照（用于调试）
     */
    protected getStateSnapshot(): Record<string, any> {
        const snapshot: Record<string, any> = {};

        this._reactiveStates.forEach((state, key) => {
            snapshot[key] = state.getter();
        });

        return snapshot;
    }

    /**
     * 清理响应式状态（组件销毁时）
     */
    protected cleanupReactiveStates(): void {
        this._reactiveStates.clear();
    }

    /**
     * 重写 disconnectedCallback 以清理状态
     */
    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.cleanupReactiveStates();
    }

    /**
     * 启用调试模式
     */
    protected enableDebug(): void {
        this._isDebugEnabled = true;
    }

    /**
     * 禁用调试模式
     */
    protected disableDebug(): void {
        this._isDebugEnabled = false;
    }
}

/**
 * 装饰器：自动使组件变为响应式
 *
 * @param debugMode 是否启用调试模式
 */
export function makeReactive(_debugMode: boolean = false) {
    return function <T extends new (...args: any[]) => WebComponent>(constructor: T) {
        return class ReactiveComponent extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // 如果不是 ReactiveWebComponent 的实例，则混入响应式能力
                if (!(this instanceof ReactiveWebComponent)) {
                    // 添加响应式方法
                    (this as any).reactive = function <U extends object>(obj: U): U {
                        return reactive(obj, () => (this as any).rerender());
                    };
                }
            }

            render(): HTMLElement {
                // 抽象方法必须由子类实现
                throw new Error("render() method must be implemented by subclass");
            }
        } as T;
    };
}

/**
 * 工具函数：创建响应式组件实例
 */
export function createReactiveComponent<T extends WebComponent>(
    ComponentClass: new (...args: any[]) => T,
    config?: ReactiveWebComponentConfig
): T {
    // 如果已经是响应式组件，直接创建实例
    if (ComponentClass.prototype instanceof ReactiveWebComponent) {
        return new ComponentClass(config);
    }

    // 否则使用装饰器包装
    const ReactiveComponent = makeReactive(config?.debug)(ComponentClass);
    return new ReactiveComponent(config);
}

// 导出响应式相关的所有功能
export { reactive, createState, ReactiveDebug } from "./utils/reactive";
export type { ReactiveCallback } from "./utils/reactive";
