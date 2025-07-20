/**
 * 响应式组件测试
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ReactiveWebComponent, makeReactive } from "../src/reactive-component";
import { WebComponent } from "../src/web-component";

// Mock WebComponent to avoid HTMLElement registration issues
jest.mock("../src/web-component", () => {
    class MockWebComponent {
        shadowRoot: any;
        connected = true;

        constructor(_config: any = {}) {
            this.shadowRoot = {
                innerHTML: "",
                appendChild: jest.fn(),
                adoptedStyleSheets: [],
            };
        }

        render() {
            return document.createElement("div");
        }

        rerender() {
            // Default implementation - can be overridden by test components
        }

        connectedCallback() {}
        disconnectedCallback() {}
        attributeChangedCallback() {}
    }

    return { WebComponent: MockWebComponent };
});

// 测试组件类
class TestReactiveComponent extends ReactiveWebComponent {
    public renderCallCount = 0;
    public lastRenderedState: any = null;

    private state = this.reactive({
        count: 0,
        message: "test",
    });

    private themeGetter: () => string;
    private themeSetter: (value: string) => void;

    constructor() {
        super();
        const [getTheme, setTheme] = this.useState("theme", "light");
        this.themeGetter = getTheme;
        this.themeSetter = setTheme;
    }

    render() {
        this.renderCallCount++;
        this.lastRenderedState = {
            count: this.state.count,
            message: this.state.message,
            theme: this.themeGetter(),
        };

        const div = document.createElement("div");
        div.textContent = `Count: ${this.state.count}, Theme: ${this.themeGetter()}`;
        return div;
    }

    rerender() {
        this.render();
    }

    // 公开方法用于测试
    public incrementCount(): void {
        this.state.count++;
    }

    public setMessage(msg: string): void {
        this.state.message = msg;
    }

    public changeTheme(theme: string): void {
        this.themeSetter(theme);
    }

    public getReactiveStateSnapshot(): Record<string, any> {
        return super.getStateSnapshot();
    }
}

// 普通组件用于装饰器测试
class TestNormalComponent extends WebComponent {
    public renderCallCount = 0;

    render() {
        this.renderCallCount++;
        const div = document.createElement("div");
        div.textContent = "Normal component";
        return div;
    }
}

describe("ReactiveWebComponent", () => {
    let component: TestReactiveComponent;

    beforeEach(() => {
        component = new TestReactiveComponent();
        component.renderCallCount = 0;
    });

    it("should create reactive component with initial state", () => {
        expect(component).toBeInstanceOf(ReactiveWebComponent);
        expect(component.renderCallCount).toBe(0);
    });

    it("should automatically rerender when reactive state changes", (done) => {
        // 获取初始渲染计数
        const initialRenderCount = component.renderCallCount;

        // 修改响应式状态
        component.incrementCount();

        // 等待微任务执行（自动重渲染）
        queueMicrotask(() => {
            expect(component.renderCallCount).toBe(initialRenderCount + 1);
            expect(component.lastRenderedState?.count).toBe(1);
            done();
        });
    });

    it("should batch multiple state changes into single rerender", (done) => {
        const initialRenderCount = component.renderCallCount;

        // 连续修改多个状态 - 应该只触发一次重渲染
        component.incrementCount();
        component.setMessage("updated");

        // 等待批量更新
        queueMicrotask(() => {
            expect(component.renderCallCount).toBe(initialRenderCount + 1);
            expect(component.lastRenderedState).toEqual(
                expect.objectContaining({
                    count: 1,
                    message: "updated",
                })
            );
            done();
        });
    });

    it("should support useState API", (done) => {
        const initialRenderCount = component.renderCallCount;

        component.changeTheme("dark");

        queueMicrotask(() => {
            expect(component.renderCallCount).toBe(initialRenderCount + 1);
            expect(component.lastRenderedState?.theme).toBe("dark");
            done();
        });
    });

    it("should provide state snapshot for debugging", () => {
        const snapshot = component.getReactiveStateSnapshot();
        expect(snapshot).toHaveProperty("theme");
        expect(typeof snapshot.theme).toBe("string");
    });

    it("should not rerender when component is not connected", (done) => {
        // 断开连接
        Object.defineProperty(component, "connected", {
            value: false,
            writable: true,
        });

        component.render();
        const initialRenderCount = component.renderCallCount;

        component.incrementCount();

        queueMicrotask(() => {
            expect(component.renderCallCount).toBe(initialRenderCount);
            done();
        });
    });

    it("should cleanup reactive states on disconnect", () => {
        const snapshot = component.getReactiveStateSnapshot();
        expect(Object.keys(snapshot).length).toBeGreaterThan(0);

        // 触发断开连接
        component.disconnectedCallback();

        const snapshotAfterCleanup = component.getReactiveStateSnapshot();
        expect(Object.keys(snapshotAfterCleanup).length).toBe(0);
    });

    it("should handle errors in render gracefully", (done) => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // 重写 render 方法使其抛出错误
        component.render = () => {
            throw new Error("Render error");
        };

        component.incrementCount();

        queueMicrotask(() => {
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
            done();
        });
    });
});

describe("makeReactive decorator", () => {
    it("should add reactive capabilities to normal component", () => {
        const ReactiveComponent = makeReactive()(TestNormalComponent);
        const instance = new ReactiveComponent();

        expect(instance).toBeInstanceOf(TestNormalComponent);
        expect(typeof (instance as any).reactive).toBe("function");
    });

    it("should not modify already reactive components", () => {
        const ReactiveComponent = makeReactive()(TestReactiveComponent);
        const instance = new ReactiveComponent();

        expect(instance).toBeInstanceOf(ReactiveWebComponent);
    });
});

describe("performance tests", () => {
    let component: TestReactiveComponent;

    beforeEach(() => {
        component = new TestReactiveComponent();
        component.renderCallCount = 0;
    });

    it("should handle rapid state changes efficiently", (done) => {
        const initialRenderCount = component.renderCallCount;

        // 快速连续修改状态
        for (let i = 0; i < 100; i++) {
            component.incrementCount();
        }

        queueMicrotask(() => {
            // 应该只触发一次重渲染
            expect(component.renderCallCount).toBe(initialRenderCount + 1);
            expect(component.lastRenderedState?.count).toBe(100);
            done();
        });
    });

    it("should handle multiple reactive objects efficiently", (done) => {
        const initialRenderCount = component.renderCallCount;

        // 创建多个响应式对象 - 注意：每个reactive()调用创建新的回调
        const obj1 = (component as any).reactive({ a: 1 });
        const obj2 = (component as any).reactive({ b: 2 });
        const obj3 = (component as any).reactive({ c: 3 });

        // 同时修改多个对象
        obj1.a = 10;
        obj2.b = 20;
        obj3.c = 30;

        queueMicrotask(() => {
            // 每个reactive对象有自己的回调函数，所以会触发多次
            // 但应该合理地处理多个更新
            expect(component.renderCallCount).toBeGreaterThan(initialRenderCount);
            expect(component.renderCallCount).toBeLessThanOrEqual(initialRenderCount + 3);
            done();
        });
    });
});
