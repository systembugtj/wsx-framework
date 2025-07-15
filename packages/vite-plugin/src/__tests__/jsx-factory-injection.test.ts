/**
 * Tests for JSX Factory Auto-Injection Bug Fix
 *
 * This test suite validates the fix for the critical bug where the WSX Vite plugin
 * failed to automatically inject JSX factory imports due to overly broad string matching.
 *
 * @see docs/design/2025-07-15-jsx-factory-auto-injection-bug.md
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { vitePluginWSX } from '../vite-plugin-wsx';
import type { Plugin } from 'vite';

// Mock plugin context for testing
interface _MockPluginContext {
  parse: () => Record<string, unknown>;
}

describe('JSX Factory Auto-Injection Bug Fix', () => {
  let plugin: Plugin;

  beforeEach(() => {
    plugin = vitePluginWSX({
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      debug: false,
    });
  });

  describe('Detection Logic', () => {
    const testCases = [
      {
        name: 'should NOT inject when h is already imported',
        code: `import { WebComponent, h, Fragment } from "@systembug/wsx-core";`,
        shouldInject: false,
      },
      {
        name: 'should NOT inject when Fragment is already imported',
        code: `import { WebComponent, Fragment } from "@systembug/wsx-core";`,
        shouldInject: false,
      },
      {
        name: 'should NOT inject when both h and Fragment are imported',
        code: `import { WebComponent, h, Fragment, autoRegister } from "@systembug/wsx-core";`,
        shouldInject: false,
      },
      {
        name: 'should inject when neither h nor Fragment are imported',
        code: `import { WebComponent, autoRegister } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`,
        shouldInject: true,
      },
      {
        name: 'should inject when other imports exist but not JSX factory',
        code: `import { WebComponent, StyleManager } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`,
        shouldInject: true,
      },
      {
        name: 'should NOT inject when no JSX syntax is present',
        code: `import { WebComponent, autoRegister } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return document.createElement('div');
  }
}`,
        shouldInject: false,
      },
    ];

    testCases.forEach(({ name, code, shouldInject }) => {
      it(name, async () => {
        const transform = plugin.transform as (
          code: string,
          id: string
        ) => Promise<{ code: string } | null>;
        const result = await transform(code, '/test/Component.wsx');

        if (shouldInject) {
          expect(result).toBeTruthy();
          expect(result.code).toContain('import { h');
        } else {
          // Should either return null (no transformation) or not add JSX imports
          if (result) {
            expect(result.code).not.toContain('import { h, Fragment } from "@systembug/wsx-core"');
          }
        }
      });
    });
  });

  describe('Regression Tests for Original Bug', () => {
    it('should NOT falsely detect h in { WebComponent }', async () => {
      const code = `import { WebComponent, autoRegister } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
      expect(result.code).toContain('WebComponent');
    });

    it('should NOT falsely detect Fragment in other identifiers', async () => {
      const code = `import { WebComponent, DocumentFragment } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
    });

    it('should handle whitespace variations in imports', async () => {
      const testCases = [
        `import {WebComponent,h,Fragment} from "@systembug/wsx-core";`,
        `import { WebComponent, h, Fragment } from "@systembug/wsx-core";`,
        `import {  WebComponent  ,  h  ,  Fragment  } from "@systembug/wsx-core";`,
        `import {
  WebComponent,
  h,
  Fragment
} from "@systembug/wsx-core";`,
      ];

      for (const code of testCases) {
        const transform = plugin.transform as (
          code: string,
          id: string
        ) => Promise<{ code: string } | null>;
        const result = await transform(code, '/test/Component.wsx');

        // Should not inject since h and Fragment are already imported
        if (result) {
          expect(result.code).not.toContain('import { h, Fragment } from "@systembug/wsx-core"');
        }
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle files without @systembug/wsx-core import', async () => {
      const code = `import React from 'react';
export class TestComponent {
  render() {
    return <div>Test</div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
    });

    it('should handle multiple imports from the same package', async () => {
      const code = `import { WebComponent } from "@systembug/wsx-core";
import { h } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      // Should not inject since h is already imported (even in separate import)
      if (result) {
        expect(result.code).not.toContain('import { h, Fragment } from "@systembug/wsx-core"');
      }
    });

    it('should handle renamed imports', async () => {
      const code = `import { WebComponent, h as jsx } from "@systembug/wsx-core";
export class TestComponent extends WebComponent {
  render() {
    return <div>Test</div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      // Should inject since 'h' is not directly imported (renamed as jsx)
      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
    });
  });

  describe('JSX Transform Integration', () => {
    it('should correctly transform JSX after injection', async () => {
      const code = `import { WebComponent, autoRegister } from "@systembug/wsx-core";
@autoRegister()
export class TestComponent extends WebComponent {
  render() {
    return <div className="test">
      <span>Hello</span>
      <button onClick={this.handleClick}>Click</button>
    </div>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
      expect(result.code).toContain('h("div"');
      expect(result.code).toContain('h("span"');
      expect(result.code).toContain('h("button"');
    });

    it('should handle Fragment usage', async () => {
      const code = `import { WebComponent, autoRegister } from "@systembug/wsx-core";
@autoRegister()
export class TestComponent extends WebComponent {
  render() {
    return <>
      <div>First</div>
      <div>Second</div>
    </>;
  }
}`;

      const transform = plugin.transform as (
        code: string,
        id: string
      ) => Promise<{ code: string } | null>;
      const result = await transform(code, '/test/Component.wsx');

      expect(result).toBeTruthy();
      expect(result.code).toContain('import { h');
      expect(result.code).toContain('Fragment');
    });
  });
});
