/**
 * Integration tests for WSX Vite Plugin
 * Tests the plugin in realistic Vite build scenarios
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { createServer, build } from 'vite';
import { vitePluginWSX } from '../src/vite-plugin-wsx';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('WSX Vite Plugin Integration', () => {
  const testDir = path.resolve(__dirname, '../__test-fixtures__');

  beforeEach(async () => {
    // Ensure test directory exists
    await fs.mkdir(testDir, { recursive: true });
  });

  describe('Development Server Integration', () => {
    test('integrates with Vite dev server', async () => {
      const server = await createServer({
        configFile: false,
        root: testDir,
        plugins: [vitePluginWSX()],
        server: { middlewareMode: true },
        optimizeDeps: { disabled: true },
      });

      expect(server).toBeDefined();
      expect(server.config.plugins).toHaveLength(1);

      const wsxPlugin = server.config.plugins.find(
        (p) => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-wsx'
      );
      expect(wsxPlugin).toBeDefined();

      await server.close();
    });

    test('processes .wsx files in dev mode', async () => {
      // Create a test .wsx file
      const testComponent = `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'test-component' })
        export class TestComponent extends WebComponent {
          render() {
            return <div>Hello from Vite!</div>;
          }
        }
      `;

      const testFile = path.join(testDir, 'TestComponent.wsx');
      await fs.writeFile(testFile, testComponent);

      const server = await createServer({
        configFile: false,
        root: testDir,
        plugins: [vitePluginWSX({ debug: false })],
        server: { middlewareMode: true },
        optimizeDeps: { disabled: true },
      });

      // Load the module through Vite's module resolution
      const module = await server.ssrLoadModule('./TestComponent.wsx');
      expect(module).toBeDefined();

      await server.close();
      await fs.unlink(testFile);
    });
  });

  describe('Build Integration', () => {
    test('builds .wsx files correctly', async () => {
      // Create test files
      const entryFile = path.join(testDir, 'main.ts');
      const componentFile = path.join(testDir, 'Component.wsx');

      await fs.writeFile(
        entryFile,
        `
        import './Component.wsx';
        console.log('App loaded');
      `
      );

      await fs.writeFile(
        componentFile,
        `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'build-test' })
        export class BuildTest extends WebComponent {
          render() {
            return <div className="build-test">Build successful!</div>;
          }
        }
      `
      );

      const buildResult = await build({
        configFile: false,
        root: testDir,
        plugins: [vitePluginWSX()],
        build: {
          write: false,
          minify: false,
          rollupOptions: {
            input: entryFile,
            external: ['@systembug/wsx-core'],
          },
        },
      });

      expect(buildResult).toBeDefined();

      // Check that the output contains transformed JSX
      if (Array.isArray(buildResult)) {
        const mainChunk = buildResult[0];
        if ('output' in mainChunk) {
          const outputFiles = mainChunk.output;
          const jsFiles = outputFiles.filter((file) => file.fileName.endsWith('.js'));
          expect(jsFiles.length).toBeGreaterThan(0);

          // Check that JSX was transformed
          const hasTransformedJSX = jsFiles.some(
            (file) => 'code' in file && file.code.includes('h("div"')
          );
          expect(hasTransformedJSX).toBe(true);
        }
      }

      // Cleanup
      await fs.unlink(entryFile);
      await fs.unlink(componentFile);
    });

    test('handles multiple .wsx files in build', async () => {
      const files = ['Component1.wsx', 'Component2.wsx', 'Component3.wsx'];

      const entryFile = path.join(testDir, 'main.ts');

      // Create entry file that imports all components
      const imports = files.map((file) => `import './${file}';`).join('\n');
      await fs.writeFile(entryFile, imports);

      // Create multiple component files
      await Promise.all(
        files.map((file, index) => {
          const content = `
          import { WebComponent, autoRegister } from '@systembug/wsx-core';
          
          @autoRegister({ tagName: 'component-${index + 1}' })
          export class Component${index + 1} extends WebComponent {
            render() {
              return <div>Component ${index + 1}</div>;
            }
          }
        `;
          return fs.writeFile(path.join(testDir, file), content);
        })
      );

      const buildResult = await build({
        configFile: false,
        root: testDir,
        plugins: [vitePluginWSX()],
        build: {
          write: false,
          minify: false,
          rollupOptions: {
            input: entryFile,
            external: ['@systembug/wsx-core'],
          },
        },
      });

      expect(buildResult).toBeDefined();

      // Cleanup
      await fs.unlink(entryFile);
      await Promise.all(files.map((file) => fs.unlink(path.join(testDir, file))));
    });
  });

  describe('Plugin Options Integration', () => {
    test('custom JSX factory works in build', async () => {
      const entryFile = path.join(testDir, 'main.ts');
      const componentFile = path.join(testDir, 'CustomFactory.wsx');

      await fs.writeFile(entryFile, `import './CustomFactory.wsx';`);

      await fs.writeFile(
        componentFile,
        `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'custom-factory' })
        export class CustomFactory extends WebComponent {
          render() {
            return <div>Custom JSX Factory</div>;
          }
        }
      `
      );

      const buildResult = await build({
        configFile: false,
        root: testDir,
        plugins: [
          vitePluginWSX({
            jsxFactory: 'customH',
            jsxFragment: 'CustomFragment',
          }),
        ],
        build: {
          write: false,
          minify: false,
          rollupOptions: {
            input: entryFile,
            external: ['@systembug/wsx-core'],
          },
        },
      });

      expect(buildResult).toBeDefined();

      // Check that custom factory is used
      if (Array.isArray(buildResult)) {
        const mainChunk = buildResult[0];
        if ('output' in mainChunk) {
          const outputFiles = mainChunk.output;
          const jsFiles = outputFiles.filter((file) => file.fileName.endsWith('.js'));

          const hasCustomFactory = jsFiles.some(
            (file) => 'code' in file && file.code.includes('customH("div"')
          );
          expect(hasCustomFactory).toBe(true);
        }
      }

      // Cleanup
      await fs.unlink(entryFile);
      await fs.unlink(componentFile);
    });

    test('custom extensions work in build', async () => {
      const entryFile = path.join(testDir, 'main.ts');
      const componentFile = path.join(testDir, 'CustomExt.custom');

      await fs.writeFile(entryFile, `import './CustomExt.custom';`);

      await fs.writeFile(
        componentFile,
        `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'custom-ext' })
        export class CustomExt extends WebComponent {
          render() {
            return <div>Custom Extension</div>;
          }
        }
      `
      );

      const buildResult = await build({
        configFile: false,
        root: testDir,
        plugins: [
          vitePluginWSX({
            extensions: ['.custom'],
          }),
        ],
        build: {
          write: false,
          minify: false,
          rollupOptions: {
            input: entryFile,
            external: ['@systembug/wsx-core'],
          },
        },
      });

      expect(buildResult).toBeDefined();

      // Cleanup
      await fs.unlink(entryFile);
      await fs.unlink(componentFile);
    });
  });

  describe('Error Handling in Build', () => {
    test('handles invalid .wsx files gracefully', async () => {
      const entryFile = path.join(testDir, 'main.ts');
      const invalidFile = path.join(testDir, 'Invalid.wsx');

      await fs.writeFile(entryFile, `import './Invalid.wsx';`);
      await fs.writeFile(
        invalidFile,
        `
        this is not valid TypeScript or JSX code <<<>>>
      `
      );

      await expect(
        build({
          configFile: false,
          root: testDir,
          plugins: [vitePluginWSX()],
          build: {
            write: false,
            rollupOptions: {
              input: entryFile,
              external: ['@systembug/wsx-core'],
            },
          },
        })
      ).rejects.toThrow();

      // Cleanup
      await fs.unlink(entryFile);
      await fs.unlink(invalidFile);
    });
  });

  describe('HMR Integration', () => {
    test('supports hot module replacement', async () => {
      const testFile = path.join(testDir, 'HMRTest.wsx');

      await fs.writeFile(
        testFile,
        `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'hmr-test' })
        export class HMRTest extends WebComponent {
          render() {
            return <div>Original content</div>;
          }
        }
      `
      );

      const server = await createServer({
        configFile: false,
        root: testDir,
        plugins: [vitePluginWSX()],
        server: { middlewareMode: true, hmr: true },
        optimizeDeps: { disabled: true },
      });

      // Load the initial module
      const initialModule = await server.ssrLoadModule('./HMRTest.wsx');
      expect(initialModule).toBeDefined();

      // Update the file
      await fs.writeFile(
        testFile,
        `
        import { WebComponent, autoRegister } from '@systembug/wsx-core';
        
        @autoRegister({ tagName: 'hmr-test' })
        export class HMRTest extends WebComponent {
          render() {
            return <div>Updated content</div>;
          }
        }
      `
      );

      // The module should be reloadable
      const updatedModule = await server.ssrLoadModule('./HMRTest.wsx');
      expect(updatedModule).toBeDefined();

      await server.close();
      await fs.unlink(testFile);
    });
  });
});
