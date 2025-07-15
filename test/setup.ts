// Global test setup
import "@testing-library/jest-dom";

// Mock window.customElements if not available
if (typeof window !== "undefined" && !window.customElements) {
    const mockCustomElements = {
        define: jest.fn(),
        get: jest.fn(),
        whenDefined: jest.fn().mockResolvedValue(undefined),
        upgrade: jest.fn(),
    };

    Object.defineProperty(window, "customElements", {
        value: mockCustomElements,
        writable: true,
    });
}

// Mock ShadowRoot if not available
if (typeof window !== "undefined" && !window.ShadowRoot) {
    class MockShadowRoot extends DocumentFragment {
        host: Element;
        constructor(host: Element) {
            super();
            this.host = host;
        }
    }

    Object.defineProperty(window, "ShadowRoot", {
        value: MockShadowRoot,
        writable: true,
    });
}
