/**
 * WSX 响应式状态系统
 *
 * 基于浏览器原生 Proxy API 实现轻量级响应式状态，
 * 遵循 WSX 设计哲学：信任浏览器，零运行时开销
 */
import { createLogger } from "./logger";

const logger = createLogger("ReactiveSystem");

/**
 * 响应式回调函数类型
 */
export type ReactiveCallback = () => void;

/**
 * 批量更新调度器
 * 使用浏览器原生的 queueMicrotask 实现批量更新
 */
class UpdateScheduler {
    private pendingCallbacks = new Set<ReactiveCallback>();
    private isScheduled = false;

    /**
     * 调度一个更新回调
     */
    schedule(callback: ReactiveCallback): void {
        this.pendingCallbacks.add(callback);

        if (!this.isScheduled) {
            this.isScheduled = true;
            // 使用浏览器原生的微任务队列
            queueMicrotask(() => {
                this.flush();
            });
        }
    }

    /**
     * 执行所有待处理的回调
     */
    private flush(): void {
        const callbacks = Array.from(this.pendingCallbacks);
        this.pendingCallbacks.clear();
        this.isScheduled = false;

        // 执行所有回调
        callbacks.forEach((callback) => {
            try {
                callback();
            } catch (error) {
                console.error("[WSX Reactive] Error in callback:", error);
            }
        });
    }
}

// 全局调度器实例
const scheduler = new UpdateScheduler();

/**
 * 创建响应式对象
 *
 * @param obj 要变为响应式的对象
 * @param onChange 状态变化时的回调函数
 * @returns 响应式代理对象
 */
export function reactive<T extends object>(obj: T, onChange: ReactiveCallback): T {
    return new Proxy(obj, {
        set(target: T, key: string | symbol, value: any): boolean {
            const oldValue = target[key as keyof T];

            // 只有值真正改变时才触发更新
            if (oldValue !== value) {
                target[key as keyof T] = value;

                // 调度更新
                scheduler.schedule(onChange);
            }

            return true;
        },

        get(target: T, key: string | symbol): any {
            return target[key as keyof T];
        },

        has(target: T, key: string | symbol): boolean {
            return key in target;
        },

        ownKeys(target: T): ArrayLike<string | symbol> {
            return Reflect.ownKeys(target);
        },

        getOwnPropertyDescriptor(target: T, key: string | symbol): PropertyDescriptor | undefined {
            return Reflect.getOwnPropertyDescriptor(target, key);
        },
    });
}

/**
 * 创建响应式状态钩子
 * 提供类似 useState 的 API
 *
 * @param initialValue 初始值
 * @param onChange 变化回调
 * @returns [getter, setter] 元组
 */
export function createState<T>(
    initialValue: T,
    onChange: ReactiveCallback
): [() => T, (value: T | ((prev: T) => T)) => void] {
    let currentValue = initialValue;

    const getter = (): T => currentValue;

    const setter = (value: T | ((prev: T) => T)): void => {
        const newValue =
            typeof value === "function" ? (value as (prev: T) => T)(currentValue) : value;

        if (currentValue !== newValue) {
            currentValue = newValue;
            scheduler.schedule(onChange);
        }
    };

    return [getter, setter];
}

/**
 * 检查一个值是否为响应式对象
 */
export function isReactive(value: any): boolean {
    return (
        value != null &&
        typeof value === "object" &&
        value.constructor === Object &&
        typeof value.valueOf === "function"
    );
}

/**
 * 开发模式下的调试工具
 */
export const ReactiveDebug = {
    /**
     * 启用调试模式
     */
    enable(): void {
        if (typeof window !== "undefined") {
            (window as any).__WSX_REACTIVE_DEBUG__ = true;
        }
    },

    /**
     * 禁用调试模式
     */
    disable(): void {
        if (typeof window !== "undefined") {
            (window as any).__WSX_REACTIVE_DEBUG__ = false;
        }
    },

    /**
     * 检查是否启用调试模式
     */
    isEnabled(): boolean {
        return typeof window !== "undefined" && (window as any).__WSX_REACTIVE_DEBUG__ === true;
    },

    /**
     * 调试日志
     */
    log(message: string, ...args: any[]): void {
        if (this.isEnabled()) {
            logger.info(`[WSX Reactive] ${message}`, ...args);
        }
    },
};

/**
 * 增强的 reactive 函数，带调试支持
 */
export function reactiveWithDebug<T extends object>(
    obj: T,
    onChange: ReactiveCallback,
    debugName?: string
): T {
    const name = debugName || obj.constructor.name || "Unknown";

    return new Proxy(obj, {
        set(target: T, key: string | symbol, value: any): boolean {
            const oldValue = target[key as keyof T];

            if (oldValue !== value) {
                ReactiveDebug.log(`State change in ${name}:`, {
                    key: String(key),
                    oldValue,
                    newValue: value,
                });

                target[key as keyof T] = value;
                scheduler.schedule(onChange);
            }

            return true;
        },

        get(target: T, key: string | symbol): any {
            return target[key as keyof T];
        },
    });
}
