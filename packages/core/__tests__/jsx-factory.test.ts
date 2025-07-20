/**
 * Unit tests for jsx-factory.ts
 * Tests JSX transformation, event handling, and DOM creation
 */

import { describe, it, expect, jest } from "@jest/globals";
import { h, Fragment, JSXChildren } from "../src/jsx-factory";
import { isSVGElement, SVG_NAMESPACE } from "../src/svg-utils";

describe("JSX Factory (h function)", () => {
    describe("Basic Element Creation", () => {
        it("should create simple HTML elements", () => {
            const element = h("div");

            expect(element).toBeInstanceOf(HTMLDivElement);
            expect(element.tagName).toBe("DIV");
        });

        it("should create elements with text content", () => {
            const element = h("span", {}, "Hello World");

            expect(element.tagName).toBe("SPAN");
            expect(element.textContent).toBe("Hello World");
        });

        it("should create elements with multiple text children", () => {
            const element = h("div", {}, "Hello", " ", "World");

            expect(element.textContent).toBe("Hello World");
        });

        it("should create elements with number children", () => {
            const element = h("span", {}, 42);

            expect(element.textContent).toBe("42");
        });
    });

    describe("Attributes and Properties", () => {
        it("should set className attribute", () => {
            const element = h("div", { className: "test-class" });

            expect(element.className).toBe("test-class");
        });

        it("should set class attribute (alias for className)", () => {
            const element = h("div", { class: "test-class" });

            expect(element.className).toBe("test-class");
        });

        it("should set style attribute", () => {
            const element = h("div", { style: "color: red; font-size: 14px;" });

            expect(element.getAttribute("style")).toBe("color: red; font-size: 14px;");
        });

        it("should set regular attributes", () => {
            const element = h("input", {
                type: "text",
                placeholder: "Enter text",
                id: "test-input",
            });

            expect(element.getAttribute("type")).toBe("text");
            expect(element.getAttribute("placeholder")).toBe("Enter text");
            expect(element.getAttribute("id")).toBe("test-input");
        });

        it("should set boolean attributes", () => {
            const enabledElement = h("button", { disabled: true });
            const disabledElement = h("button", { disabled: false });

            expect(enabledElement.hasAttribute("disabled")).toBe(true);
            expect(disabledElement.hasAttribute("disabled")).toBe(false);
        });

        it("should set data attributes", () => {
            const element = h("div", {
                "data-testid": "my-component",
                "data-value": "123",
            });

            expect(element.getAttribute("data-testid")).toBe("my-component");
            expect(element.getAttribute("data-value")).toBe("123");
        });

        it("should ignore null, undefined, and false values", () => {
            const element = h("div", {
                "data-null": null,
                "data-undefined": undefined,
                "data-false": false,
                "data-valid": "value",
            });

            expect(element.hasAttribute("data-null")).toBe(false);
            expect(element.hasAttribute("data-undefined")).toBe(false);
            expect(element.hasAttribute("data-false")).toBe(false);
            expect(element.getAttribute("data-valid")).toBe("value");
        });
    });

    describe("Event Handlers", () => {
        it("should attach click event listeners", () => {
            const clickHandler = jest.fn();
            const element = h("button", { onClick: clickHandler });

            element.click();

            expect(clickHandler).toHaveBeenCalledTimes(1);
            expect(clickHandler).toHaveBeenCalledWith(expect.any(Event));
        });

        it("should attach input event listeners", () => {
            const inputHandler = jest.fn();
            const element = h("input", {
                onInput: inputHandler,
            }) as HTMLInputElement;

            // Simulate input event
            element.value = "test";
            element.dispatchEvent(new Event("input"));

            expect(inputHandler).toHaveBeenCalledTimes(1);
        });

        it("should attach multiple event listeners", () => {
            const clickHandler = jest.fn();
            const mouseOverHandler = jest.fn();
            const focusHandler = jest.fn();

            const element = h("button", {
                onClick: clickHandler,
                onMouseOver: mouseOverHandler,
                onFocus: focusHandler,
            });

            element.click();
            element.dispatchEvent(new Event("mouseover"));
            element.dispatchEvent(new Event("focus"));

            expect(clickHandler).toHaveBeenCalledTimes(1);
            expect(mouseOverHandler).toHaveBeenCalledTimes(1);
            expect(focusHandler).toHaveBeenCalledTimes(1);
        });

        it("should handle event names correctly (case conversion)", () => {
            const changeHandler = jest.fn();
            const element = h("select", { onChange: changeHandler });

            element.dispatchEvent(new Event("change"));

            expect(changeHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe("Ref Callbacks", () => {
        it("should call ref callback with the element", () => {
            const refCallback = jest.fn();
            const element = h("div", { ref: refCallback }, "Content");

            expect(refCallback).toHaveBeenCalledTimes(1);
            expect(refCallback).toHaveBeenCalledWith(element);
        });

        it("should provide element reference for manipulation", () => {
            let capturedElement: HTMLElement | null = null;

            const element = h("input", {
                ref: (el: HTMLElement) => {
                    capturedElement = el;
                    (el as HTMLInputElement).value = "ref-set-value";
                },
            });

            expect(capturedElement).toBe(element);
            expect((element as HTMLInputElement).value).toBe("ref-set-value");
        });
    });

    describe("Nested Elements", () => {
        it("should create nested element structures", () => {
            const element = h("div", { className: "container" }, [
                h("h1", {}, "Title"),
                h("p", {}, "Paragraph"),
                h("button", { type: "button" }, "Click me"),
            ]);

            expect(element.children).toHaveLength(3);
            expect(element.children[0].tagName).toBe("H1");
            expect(element.children[1].tagName).toBe("P");
            expect(element.children[2].tagName).toBe("BUTTON");

            expect(element.children[0].textContent).toBe("Title");
            expect(element.children[1].textContent).toBe("Paragraph");
            expect(element.children[2].textContent).toBe("Click me");
        });

        it("should handle mixed children types", () => {
            const button = h("button", {}, "Button");
            const element = h("div", {}, [
                "Text before",
                h("span", {}, "Span"),
                "Text after",
                button,
                42,
            ]);

            expect(element.childNodes).toHaveLength(5);
            expect(element.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
            expect(element.childNodes[1].nodeType).toBe(Node.ELEMENT_NODE);
            expect(element.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
            expect(element.childNodes[3]).toBe(button);
            expect(element.childNodes[4].textContent).toBe("42");
        });

        it("should flatten nested arrays of children", () => {
            const element = h("ul", {}, [
                h("li", {}, "Item 1"),
                [h("li", {}, "Item 2"), h("li", {}, "Item 3")],
                h("li", {}, "Item 4"),
            ]);

            expect(element.children).toHaveLength(4);
            expect(element.children[0].textContent).toBe("Item 1");
            expect(element.children[1].textContent).toBe("Item 2");
            expect(element.children[2].textContent).toBe("Item 3");
            expect(element.children[3].textContent).toBe("Item 4");
        });
    });

    describe("Null and Undefined Children", () => {
        it("should ignore null children", () => {
            const element = h("div", {}, ["Valid text", null, h("span", {}, "Valid span"), null]);

            expect(element.childNodes).toHaveLength(2);
            expect(element.childNodes[0].textContent).toBe("Valid text");
            expect(element.childNodes[1].nodeName).toBe("SPAN");
        });

        it("should ignore undefined children", () => {
            const element = h("div", {}, [
                "Valid text",
                undefined,
                h("span", {}, "Valid span"),
                undefined,
            ]);

            expect(element.childNodes).toHaveLength(2);
        });

        it("should ignore false children", () => {
            const element = h("div", {}, ["Valid text", false, h("span", {}, "Valid span"), false]);

            expect(element.childNodes).toHaveLength(2);
        });
    });

    describe("Component Functions", () => {
        it("should handle component functions", () => {
            const Button = (props: Record<string, unknown>, children: unknown[]) => {
                return h(
                    "button",
                    {
                        className: `btn ${props.variant || "primary"}`,
                        onClick: props.onClick,
                    },
                    children as JSXChildren[]
                );
            };

            const clickHandler = jest.fn();
            const element = h(Button, { variant: "secondary", onClick: clickHandler }, "Click me");

            expect(element.tagName).toBe("BUTTON");
            expect(element.className).toBe("btn secondary");
            expect(element.textContent).toBe("Click me");

            element.click();
            expect(clickHandler).toHaveBeenCalledTimes(1);
        });

        it("should pass props and children to component functions", () => {
            const componentSpy = jest.fn((props, children) => {
                return h(
                    "div",
                    { "data-props": JSON.stringify(props) },
                    ...(Array.isArray(children) ? children : [children])
                );
            });

            const element = h(componentSpy, { id: "test", value: 42 }, "Child content");

            expect(componentSpy).toHaveBeenCalledWith({ id: "test", value: 42 }, ["Child content"]);

            expect(element.getAttribute("data-props")).toBe('{"id":"test","value":42}');
            expect(element.textContent).toBe("Child content");
        });
    });

    describe("Document Fragments", () => {
        it("should handle DocumentFragment children", () => {
            const fragment = document.createDocumentFragment();
            fragment.appendChild(h("span", {}, "Fragment content"));

            const element = h("div", {}, ["Before fragment", fragment, "After fragment"]);

            expect(element.childNodes).toHaveLength(3);
            expect(element.childNodes[0].textContent).toBe("Before fragment");
            expect(element.childNodes[1].textContent).toBe("Fragment content");
            expect(element.childNodes[2].textContent).toBe("After fragment");
        });
    });
});

describe("Fragment", () => {
    it("should create DocumentFragment", () => {
        const fragment = Fragment(null, ["Hello", " ", "World"]);

        expect(fragment).toBeInstanceOf(DocumentFragment);
        expect(fragment.textContent).toBe("Hello World");
    });

    it("should create DocumentFragment with element children", () => {
        const fragment = Fragment(null, [h("span", {}, "First"), h("span", {}, "Second")]);

        expect(fragment.childNodes).toHaveLength(2);
        expect(fragment.childNodes[0].textContent).toBe("First");
        expect(fragment.childNodes[1].textContent).toBe("Second");
    });

    it("should flatten nested arrays in Fragment", () => {
        const fragment = Fragment(null, [
            "Text",
            [h("span", {}, "Span 1"), h("span", {}, "Span 2")],
            "More text",
        ]);

        expect(fragment.childNodes).toHaveLength(4);
        expect(fragment.childNodes[0].textContent).toBe("Text");
        expect(fragment.childNodes[1].textContent).toBe("Span 1");
        expect(fragment.childNodes[2].textContent).toBe("Span 2");
        expect(fragment.childNodes[3].textContent).toBe("More text");
    });

    it("should ignore null/undefined/false children in Fragment", () => {
        const fragment = Fragment(null, [
            "Valid",
            null,
            undefined,
            false,
            h("span", {}, "Also valid"),
        ]);

        expect(fragment.childNodes).toHaveLength(2);
        expect(fragment.childNodes[0].textContent).toBe("Valid");
        expect(fragment.childNodes[1].textContent).toBe("Also valid");
    });
});

describe("Edge Cases and Error Handling", () => {
    it("should handle empty props object", () => {
        const element = h("div", {});

        expect(element.tagName).toBe("DIV");
        expect(element.attributes).toHaveLength(0);
    });

    it("should handle null props", () => {
        const element = h("div", null, "Content");

        expect(element.tagName).toBe("DIV");
        expect(element.textContent).toBe("Content");
    });

    it("should handle empty children array", () => {
        const element = h("div", {}, []);

        expect(element.tagName).toBe("DIV");
        expect(element.childNodes).toHaveLength(0);
    });

    it("should handle no children", () => {
        const element = h("div");

        expect(element.tagName).toBe("DIV");
        expect(element.childNodes).toHaveLength(0);
    });

    it("should convert numbers to strings for attribute values", () => {
        const element = h("input", { tabIndex: 5, "data-count": 42 });

        expect(element.getAttribute("tabindex")).toBe("5");
        expect(element.getAttribute("data-count")).toBe("42");
    });
});

describe("SVG Element Support", () => {
    describe("SVG Element Creation", () => {
        it("should create SVG elements with correct namespace", () => {
            const svgElement = h("svg");

            expect(svgElement).toBeInstanceOf(SVGElement);
            expect(svgElement.namespaceURI).toBe(SVG_NAMESPACE);
            expect(svgElement.tagName).toBe("svg");
        });

        it("should create SVG graphics elements", () => {
            const circle = h("circle");
            const rect = h("rect");
            const path = h("path");

            expect(circle).toBeInstanceOf(SVGElement);
            expect(rect).toBeInstanceOf(SVGElement);
            expect(path).toBeInstanceOf(SVGElement);
            expect(circle.namespaceURI).toBe(SVG_NAMESPACE);
            expect(rect.namespaceURI).toBe(SVG_NAMESPACE);
            expect(path.namespaceURI).toBe(SVG_NAMESPACE);
        });

        it("should create SVG text elements", () => {
            const text = h("text");
            const tspan = h("tspan");

            expect(text).toBeInstanceOf(SVGElement);
            expect(tspan).toBeInstanceOf(SVGElement);
            expect(text.tagName).toBe("text");
            expect(tspan.tagName).toBe("tspan");
        });

        it("should create SVG gradient elements", () => {
            const linearGradient = h("linearGradient");
            const stop = h("stop");

            expect(linearGradient).toBeInstanceOf(SVGElement);
            expect(stop).toBeInstanceOf(SVGElement);
            expect(linearGradient.tagName).toBe("linearGradient");
            expect(stop.tagName).toBe("stop");
        });
    });

    describe("SVG Attributes", () => {
        it("should handle className as class attribute for SVG", () => {
            const circle = h("circle", { className: "my-circle" });

            expect(circle.getAttribute("class")).toBe("my-circle");
            // SVG elements don't have className property
            expect((circle as any).className).not.toBe("my-circle");
        });

        it("should handle class attribute for SVG", () => {
            const rect = h("rect", { class: "my-rect" });

            expect(rect.getAttribute("class")).toBe("my-rect");
        });

        it("should handle SVG-specific attributes", () => {
            const circle = h("circle", {
                cx: "50",
                cy: "50",
                r: "25",
                fill: "red",
                stroke: "blue",
                "stroke-width": "2",
            });

            expect(circle.getAttribute("cx")).toBe("50");
            expect(circle.getAttribute("cy")).toBe("50");
            expect(circle.getAttribute("r")).toBe("25");
            expect(circle.getAttribute("fill")).toBe("red");
            expect(circle.getAttribute("stroke")).toBe("blue");
            expect(circle.getAttribute("stroke-width")).toBe("2");
        });

        it("should handle viewBox attribute", () => {
            const svg = h("svg", {
                viewBox: "0 0 100 100",
                width: "200",
                height: "200",
            });

            expect(svg.getAttribute("viewBox")).toBe("0 0 100 100");
            expect(svg.getAttribute("width")).toBe("200");
            expect(svg.getAttribute("height")).toBe("200");
        });

        it("should handle camelCase SVG attributes", () => {
            const text = h("text", {
                textAnchor: "middle",
                dominantBaseline: "central",
            });

            expect(text.getAttribute("textAnchor")).toBe("middle");
            expect(text.getAttribute("dominantBaseline")).toBe("central");
        });
    });

    describe("SVG Nested Structure", () => {
        it("should create nested SVG structure", () => {
            const svg = h("svg", { viewBox: "0 0 100 100", width: "100", height: "100" }, [
                h("circle", { cx: "25", cy: "25", r: "20", fill: "red" }),
                h("rect", { x: "50", y: "50", width: "40", height: "40", fill: "blue" }),
                h("text", { x: "50", y: "25", textAnchor: "middle" }, "Hello SVG"),
            ]);

            expect(svg.children).toHaveLength(3);
            expect(svg.children[0].tagName).toBe("circle");
            expect(svg.children[1].tagName).toBe("rect");
            expect(svg.children[2].tagName).toBe("text");
            expect(svg.children[2].textContent).toBe("Hello SVG");
        });

        it("should create SVG with gradients", () => {
            const svg = h("svg", { viewBox: "0 0 100 100" }, [
                h("defs", {}, [
                    h("linearGradient", { id: "grad1" }, [
                        h("stop", { offset: "0%", "stop-color": "red" }),
                        h("stop", { offset: "100%", "stop-color": "blue" }),
                    ]),
                ]),
                h("circle", { cx: "50", cy: "50", r: "40", fill: "url(#grad1)" }),
            ]);

            const defs = svg.children[0];
            const gradient = defs.children[0];

            expect(defs.tagName).toBe("defs");
            expect(gradient.tagName).toBe("linearGradient");
            expect(gradient.children).toHaveLength(2);
            expect(gradient.children[0].tagName).toBe("stop");
            expect(gradient.children[1].tagName).toBe("stop");
        });
    });

    describe("SVG Event Handling", () => {
        it("should attach event listeners to SVG elements", () => {
            const clickHandler = jest.fn();
            const circle = h("circle", {
                cx: "50",
                cy: "50",
                r: "25",
                onClick: clickHandler,
            });

            circle.dispatchEvent(new Event("click"));

            expect(clickHandler).toHaveBeenCalledTimes(1);
        });

        it("should handle multiple events on SVG elements", () => {
            const mouseEnterHandler = jest.fn();
            const mouseLeaveHandler = jest.fn();

            const rect = h("rect", {
                x: "10",
                y: "10",
                width: "50",
                height: "50",
                onMouseEnter: mouseEnterHandler,
                onMouseLeave: mouseLeaveHandler,
            });

            rect.dispatchEvent(new Event("mouseenter"));
            rect.dispatchEvent(new Event("mouseleave"));

            expect(mouseEnterHandler).toHaveBeenCalledTimes(1);
            expect(mouseLeaveHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe("Mixed HTML and SVG", () => {
        it("should correctly differentiate HTML and SVG elements", () => {
            const htmlDiv = h("div");
            const svgCircle = h("circle");

            expect(htmlDiv).toBeInstanceOf(HTMLDivElement);
            expect(svgCircle).toBeInstanceOf(SVGElement);
            expect(htmlDiv.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
            expect(svgCircle.namespaceURI).toBe(SVG_NAMESPACE);
        });

        it("should handle className differently for HTML vs SVG", () => {
            const htmlDiv = h("div", { className: "html-class" });
            const svgCircle = h("circle", { className: "svg-class" });

            expect(htmlDiv.className).toBe("html-class");
            expect(htmlDiv.getAttribute("class")).toBe("html-class");

            expect(svgCircle.getAttribute("class")).toBe("svg-class");
            expect((svgCircle as any).className).not.toBe("svg-class");
        });

        it("should create complex mixed structure", () => {
            const container = h("div", { className: "svg-container" }, [
                h("h2", {}, "SVG Example"),
                h("svg", { viewBox: "0 0 100 100", width: "100" }, [
                    h("circle", { cx: "50", cy: "50", r: "40", fill: "green" }),
                ]),
                h("p", {}, "Description below SVG"),
            ]);

            expect(container.children).toHaveLength(3);
            expect(container.children[0]).toBeInstanceOf(HTMLHeadingElement);
            expect(container.children[1]).toBeInstanceOf(SVGElement);
            expect(container.children[2]).toBeInstanceOf(HTMLParagraphElement);

            const svg = container.children[1];
            expect(svg.children[0].tagName).toBe("circle");
        });
    });
});

describe("SVG Utils", () => {
    describe("isSVGElement function", () => {
        it("should correctly identify SVG elements", () => {
            expect(isSVGElement("svg")).toBe(true);
            expect(isSVGElement("circle")).toBe(true);
            expect(isSVGElement("rect")).toBe(true);
            expect(isSVGElement("path")).toBe(true);
            expect(isSVGElement("text")).toBe(true);
            expect(isSVGElement("linearGradient")).toBe(true);
            expect(isSVGElement("stop")).toBe(true);
        });

        it("should correctly identify non-SVG elements", () => {
            expect(isSVGElement("div")).toBe(false);
            expect(isSVGElement("span")).toBe(false);
            expect(isSVGElement("button")).toBe(false);
            expect(isSVGElement("input")).toBe(false);
            expect(isSVGElement("unknown-element")).toBe(false);
        });

        it("should be case sensitive", () => {
            expect(isSVGElement("SVG")).toBe(false);
            expect(isSVGElement("Circle")).toBe(false);
            expect(isSVGElement("RECT")).toBe(false);
        });
    });
});
