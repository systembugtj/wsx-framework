/**
 * Tests for vite-plugin-wsx
 */

import { describe, test, expect, beforeEach } from "@jest/globals";
import { vitePluginWSX } from "../vite-plugin-wsx";
import type { Plugin } from "vite";

// Mock plugin context for testing
interface MockPluginContext {
    parse: () => Record<string, unknown>;
}

describe("WSX Vite Plugin", () => {
    let plugin: Plugin;

    beforeEach(() => {
        plugin = vitePluginWSX();
    });

    describe("Plugin Configuration", () => {
        test("returns correct plugin structure", () => {
            expect(plugin).toHaveProperty("name", "vite-plugin-wsx");
            expect(plugin).toHaveProperty("enforce", "pre");
            expect(plugin).toHaveProperty("load");
            expect(plugin).toHaveProperty("transform");
            expect(plugin).toHaveProperty("buildStart");
        });

        test("accepts custom options", () => {
            const customPlugin = vitePluginWSX({
                jsxFactory: "customH",
                jsxFragment: "CustomFragment",
                debug: true,
                extensions: [".custom"],
            });

            expect(customPlugin.name).toBe("vite-plugin-wsx");
        });

        test("uses default options when none provided", () => {
            const defaultPlugin = vitePluginWSX();
            expect(defaultPlugin.name).toBe("vite-plugin-wsx");
        });
    });

    describe("File Loading", () => {
        test("handles .wsx files", () => {
            const loadResult = plugin.load?.call(
                { parse: () => ({}) } as MockPluginContext,
                "test.wsx"
            );
            expect(loadResult).toBeNull(); // Let Vite continue processing
        });

        test("ignores non-.wsx files", () => {
            const loadResult = plugin.load?.call(
                { parse: () => ({}) } as MockPluginContext,
                "test.ts"
            );
            expect(loadResult).toBeNull();
        });

        test("handles custom extensions", () => {
            const customPlugin = vitePluginWSX({
                extensions: [".custom"],
            });

            const loadResult = customPlugin.load?.call(
                { parse: () => ({}) } as MockPluginContext,
                "test.custom"
            );
            expect(loadResult).toBeNull();
        });
    });

    describe("Code Transformation", () => {
        test("transforms .wsx files with JSX", async () => {
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello World</div>;
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            expect(typeof result).toBe("object");
            if (typeof result === "object" && result !== null) {
                expect(result.code).toContain('h("div"');
            }
        });

        test("auto-injects JSX imports when missing", async () => {
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello</div>;
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                expect(result.code).toContain("import { h");
            }
        });

        test("skips injection when JSX imports already exist", async () => {
            const code = `
        import { WebComponent, autoRegister, h, Fragment } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello</div>;
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                // Should not add duplicate imports - the plugin should not modify existing imports
                const importLines = result.code
                    .split("\n")
                    .filter((line) => line.includes("import") && line.includes("@wsxjs/wsx-core"));
                expect(importLines.length).toBe(1);
            }
        });

        test("handles Fragment usage", async () => {
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return (
              <Fragment>
                <div>First</div>
                <div>Second</div>
              </Fragment>
            );
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                expect(result.code).toContain("import { h");
                expect(result.code).toContain("Fragment");
            }
        });

        test("ignores non-.wsx files", async () => {
            const code = `
        import React from 'react';
        export const Component = () => <div>React component</div>;
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.tsx"
            );

            expect(result).toBeNull();
        });

        test("handles code without JSX", async () => {
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          private value = 'hello';

          getValue() {
            return this.value;
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                // Should still transform but not inject JSX imports
                expect(result.code).not.toContain("import { h, Fragment }");
            }
        });

        test("uses custom JSX factory options", async () => {
            const customPlugin = vitePluginWSX({
                jsxFactory: "customH",
                jsxFragment: "CustomFragment",
            });

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello</div>;
          }
        }
      `;

            const result = await customPlugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                expect(result.code).toContain("import { customH");
                expect(result.code).toContain('customH("div"');
            }
        });

        test("handles complex JSX with event handlers", async () => {
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return (
              <div className="container">
                <button onClick={this.handleClick}>
                  Click me
                </button>
                <input onChange={this.handleChange} />
              </div>
            );
          }

          private handleClick = () => {};
          private handleChange = () => {};
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
            if (typeof result === "object" && result !== null) {
                expect(result.code).toContain("import { h");
                expect(result.code).toContain('h("div"');
                expect(result.code).toContain('h("button"');
                expect(result.code).toContain('h("input"');
            }
        });
    });

    describe("Error Handling", () => {
        test("handles transform errors gracefully", async () => {
            const invalidCode = `
        this is not valid typescript code <<<>>>
      `;

            await expect(
                plugin.transform?.call(
                    { parse: () => ({}) } as MockPluginContext,
                    invalidCode,
                    "test.wsx"
                )
            ).rejects.toThrow();
        });

        test("continues processing on minor syntax issues", async () => {
            // Test with code that has minor issues but should still transform
            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello</div>;
          }
        }
      `;

            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "test.wsx"
            );

            expect(result).toBeDefined();
        });
    });

    describe("Debug Mode", () => {
        test("logs debug information when enabled", () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            // Trigger buildStart
            debugPlugin.buildStart?.call({} as Record<string, unknown>, {});

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        test("does not log when debug is disabled", () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const normalPlugin = vitePluginWSX({ debug: false });

            // Trigger buildStart
            normalPlugin.buildStart?.call({} as Record<string, unknown>, {});

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        test("logs load debug information when enabled", () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            // Trigger load
            debugPlugin.load?.call({} as Record<string, unknown>, "test.wsx");

            expect(consoleSpy).toHaveBeenCalledWith("[WSX Plugin] Loading: test.wsx");
            consoleSpy.mockRestore();
        });

        test("logs transform debug information when enabled", async () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Debug Test</div>;
          }
        }
      `;

            // Trigger transform
            await debugPlugin.transform?.call({} as Record<string, unknown>, code, "test.wsx");

            expect(consoleSpy).toHaveBeenCalledWith("[WSX Plugin] Processing: test.wsx");
            expect(consoleSpy).toHaveBeenCalledWith(
                "[WSX Plugin] Checking JSX imports for: test.wsx"
            );
            expect(consoleSpy).toHaveBeenCalledWith(
                "[WSX Plugin] Added JSX factory import to: test.wsx"
            );
            expect(consoleSpy).toHaveBeenCalledWith("[WSX Plugin] JSX transformed: test.wsx");

            consoleSpy.mockRestore();
        });

        test("logs detailed import analysis in debug mode", async () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Debug Test</div>;
          }
        }
      `;

            // Trigger transform
            await debugPlugin.transform?.call({} as Record<string, unknown>, code, "test.wsx");

            expect(consoleSpy).toHaveBeenCalledWith("  - hasWSXCoreImport: false");
            expect(consoleSpy).toHaveBeenCalledWith("  - hasJSXInImport: false");
            expect(consoleSpy).toHaveBeenCalledWith("  - has < character: true");
            expect(consoleSpy).toHaveBeenCalledWith("  - has Fragment: false");

            consoleSpy.mockRestore();
        });

        test("logs when JSX factory import is added", async () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Test</div>;
          }
        }
      `;

            // Trigger transform
            await debugPlugin.transform?.call({} as Record<string, unknown>, code, "test.wsx");

            expect(consoleSpy).toHaveBeenCalledWith(
                "[WSX Plugin] Added JSX factory import to: test.wsx"
            );
            consoleSpy.mockRestore();
        });

        test("logs when JSX transformation is complete", async () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            const debugPlugin = vitePluginWSX({ debug: true });

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Test</div>;
          }
        }
      `;

            // Trigger transform
            await debugPlugin.transform?.call({} as Record<string, unknown>, code, "test.wsx");

            expect(consoleSpy).toHaveBeenCalledWith("[WSX Plugin] JSX transformed: test.wsx");
            consoleSpy.mockRestore();
        });
    });

    describe("Performance", () => {
        test("transforms large files efficiently", async () => {
            // Generate a large component with many elements
            const largeJSX = Array.from(
                { length: 100 },
                (_, i) => `<div key="${i}">Item ${i}</div>`
            ).join("\n        ");

            const code = `
        import { WebComponent, autoRegister } from '@wsxjs/wsx-core';

        @autoRegister()
        export class LargeComponent extends WebComponent {
          render() {
            return (
              <div>
                ${largeJSX}
              </div>
            );
          }
        }
      `;

            const startTime = Date.now();
            const result = await plugin.transform?.call(
                { parse: () => ({}) } as MockPluginContext,
                code,
                "large.wsx"
            );
            const endTime = Date.now();

            expect(result).toBeDefined();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});
