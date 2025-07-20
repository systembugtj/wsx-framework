/**
 * 响应式 WSX Web Component
 *
 * 扩展基础 WebComponent，提供响应式状态支持
 * 遵循 WSX 理念：可选使用，不破坏现有组件
 */

import { WebComponent, type WebComponentConfig } from "./web-component";
import { reactive, createState, reactiveWithDebug } from "./reactive";

/**
 * 响应式 WebComponent 配置
 */
export interface ReactiveWebComponentConfig extends WebComponentConfig {
    /** 是否启用响应式调试模式 */
    debug?: boolean;
}

/**
 * 响应式 WebComponent 基类
 *
 * 提供响应式状态管理能力，同时保持与标准 WebComponent 的完全兼容
 */
export abstract class ReactiveWebComponent extends WebComponent {
    private _isDebugEnabled: boolean = false;
    private _reactiveStates = new Map<string, any>();

    constructor(config: ReactiveWebComponentConfig = {}) {
        super(config);

        this._isDebugEnabled = config.debug ?? false;
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
            
            render() {
                return super.render ? super.render() : document.createElement('div');
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
export { reactive, createState, ReactiveDebug } from "./reactive";
export type { ReactiveCallback } from "./reactive";
