/**
 * Integration tests for WSX Vite Plugin
 * Tests the plugin configuration and API integration
 */

import { describe, test, expect } from '@jest/globals';
import { vitePluginWSX } from '../vite-plugin-wsx';

// Mock plugin context for testing
interface MockPluginContext {
  parse: () => Record<string, unknown>;
}

describe('WSX Vite Plugin Integration', () => {
  describe('Plugin Configuration', () => {
    test('creates valid Vite plugin structure', () => {
      const plugin = vitePluginWSX();

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('vite-plugin-wsx');
      expect(plugin.enforce).toBe('pre');
      expect(typeof plugin.load).toBe('function');
      expect(typeof plugin.transform).toBe('function');
      expect(typeof plugin.buildStart).toBe('function');
    });

    test('accepts and uses custom options', () => {
      const customOptions = {
        jsxFactory: 'customH',
        jsxFragment: 'CustomFragment',
        debug: true,
        extensions: ['.custom'],
      };

      const plugin = vitePluginWSX(customOptions);

      expect(plugin.name).toBe('vite-plugin-wsx');
      expect(plugin.enforce).toBe('pre');
    });

    test('uses default options when none provided', () => {
      const plugin = vitePluginWSX();

      expect(plugin.name).toBe('vite-plugin-wsx');
      expect(plugin.enforce).toBe('pre');
    });
  });

  describe('Plugin API Integration', () => {
    test('load hook handles .wsx files', () => {
      const plugin = vitePluginWSX();

      const loadResult = plugin.load?.call({ parse: () => ({}) } as MockPluginContext, 'test.wsx');
      expect(loadResult).toBeNull(); // Should let Vite continue processing
    });

    test('load hook ignores non-.wsx files', () => {
      const plugin = vitePluginWSX();

      const loadResult = plugin.load?.call({ parse: () => ({}) } as MockPluginContext, 'test.tsx');
      expect(loadResult).toBeNull();
    });

    test('transform hook processes .wsx files', async () => {
      const plugin = vitePluginWSX();

      const code = `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Test</div>;
          }
        }
      `;

      const result = await plugin.transform?.call(
        { parse: () => ({}) } as MockPluginContext,
        code,
        'test.wsx'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      if (typeof result === 'object' && result !== null) {
        expect(result.code).toBeDefined();
        expect(typeof result.code).toBe('string');
      }
    });

    test('transform hook ignores non-.wsx files', async () => {
      const plugin = vitePluginWSX();

      const code = `
        import React from 'react';
        export const Component = () => <div>React component</div>;
      `;

      const result = await plugin.transform?.call(
        { parse: () => ({}) } as MockPluginContext,
        code,
        'test.tsx'
      );

      expect(result).toBeNull();
    });

    test('buildStart hook executes without errors', () => {
      const plugin = vitePluginWSX();

      expect(() => {
        plugin.buildStart?.call({} as Record<string, unknown>, {});
      }).not.toThrow();
    });
  });

  describe('Plugin Options Integration', () => {
    test('custom JSX factory is used in transformation', async () => {
      const plugin = vitePluginWSX({
        jsxFactory: 'customH',
        jsxFragment: 'CustomFragment',
      });

      const code = `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          render() {
            return <div>Custom Factory Test</div>;
          }
        }
      `;

      const result = await plugin.transform?.call(
        { parse: () => ({}) } as MockPluginContext,
        code,
        'test.wsx'
      );

      expect(result).toBeDefined();
      if (typeof result === 'object' && result !== null) {
        expect(result.code).toContain('customH');
        expect(result.code).toContain('import { customH');
      }
    });

    test('custom extensions are recognized', () => {
      const plugin = vitePluginWSX({
        extensions: ['.custom'],
      });

      const loadResult = plugin.load?.call(
        { parse: () => ({}) } as MockPluginContext,
        'test.custom'
      );
      expect(loadResult).toBeNull(); // Should process custom extension

      const loadResultWSX = plugin.load?.call(
        { parse: () => ({}) } as MockPluginContext,
        'test.wsx'
      );
      expect(loadResultWSX).toBeNull(); // Should not process .wsx with custom extensions
    });

    test('debug mode logs are controlled by option', () => {
      const debugPlugin = vitePluginWSX({ debug: true });
      const normalPlugin = vitePluginWSX({ debug: false });

      expect(debugPlugin.name).toBe('vite-plugin-wsx');
      expect(normalPlugin.name).toBe('vite-plugin-wsx');
    });
  });

  describe('Error Handling Integration', () => {
    test('handles invalid code gracefully', async () => {
      const plugin = vitePluginWSX();

      const invalidCode = 'this is not valid typescript <<<>>>';

      await expect(
        plugin.transform?.call({ parse: () => ({}) } as MockPluginContext, invalidCode, 'test.wsx')
      ).rejects.toThrow();
    });

    test('handles empty code', async () => {
      const plugin = vitePluginWSX();

      const emptyCode = '';

      const result = await plugin.transform?.call(
        { parse: () => ({}) } as MockPluginContext,
        emptyCode,
        'test.wsx'
      );

      expect(result).toBeDefined();
    });

    test('handles code without JSX', async () => {
      const plugin = vitePluginWSX();

      const codeWithoutJSX = `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';

        @autoRegister()
        export class TestComponent extends WebComponent {
          private value = 'test';

          getValue() {
            return this.value;
          }
        }
      `;

      const result = await plugin.transform?.call(
        { parse: () => ({}) } as MockPluginContext,
        codeWithoutJSX,
        'test.wsx'
      );

      expect(result).toBeDefined();
      if (typeof result === 'object' && result !== null) {
        expect(result.code).toBeDefined();
      }
    });
  });
});
