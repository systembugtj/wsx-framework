/**
 * Test for WSX Button component using Vitest
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { WebComponent, autoRegister, h } from "@systembug/wsx-core";

@autoRegister({ tagName: "test-button" })
class TestButton extends WebComponent {
    constructor() {
        super({
            styles: `
                .button {
                    padding: 8px 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: #f5f5f5;
                    cursor: pointer;
                }
                .button:hover {
                    background: #e5e5e5;
                }
            `,
        });
    }

    render() {
        return h(
            "button",
            {
                className: "button",
                onClick: this.handleClick,
            },
            h("slot")
        );
    }

    private handleClick = () => {
        this.dispatchEvent(
            new CustomEvent("button-click", {
                detail: { message: "Button clicked!" },
            })
        );
    };
}

describe("WSX Button Component", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it("should create button component", () => {
        const button = document.createElement("test-button") as TestButton;
        expect(button).toBeInstanceOf(TestButton);
        expect(button.tagName.toLowerCase()).toBe("test-button");
    });

    it("should render button with slot content", () => {
        const button = document.createElement("test-button") as TestButton;
        button.textContent = "Click me";

        container.appendChild(button);

        // Check if shadow DOM is created
        expect(button.shadowRoot).toBeTruthy();

        // Check if button element exists in shadow DOM
        const shadowButton = button.shadowRoot?.querySelector("button");
        expect(shadowButton).toBeTruthy();
        expect(shadowButton?.className).toBe("button");
    });

    it("should handle button clicks", () => {
        return new Promise<void>((resolve) => {
            const button = document.createElement("test-button") as TestButton;
            button.textContent = "Click me";

            container.appendChild(button);

            // Listen for custom event
            button.addEventListener("button-click", (event: Event) => {
                const customEvent = event as CustomEvent;
                expect(customEvent.detail.message).toBe("Button clicked!");
                resolve();
            });

            // Simulate click
            const shadowButton = button.shadowRoot?.querySelector("button");
            shadowButton?.click();
        });
    });

    it("should support styling", () => {
        const button = document.createElement("test-button") as TestButton;
        container.appendChild(button);

        // Check if styles are applied via shadow DOM
        expect(button.shadowRoot?.adoptedStyleSheets).toBeDefined();

        const shadowButton = button.shadowRoot?.querySelector("button");
        expect(shadowButton).toBeTruthy();
    });
});
