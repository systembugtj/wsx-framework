# WSX Base Components

基于 WSX Framework 构建的基础 UI 组件库。

## 特性

- 🎯 **零运行时开销** - 基于原生 Web Components
- 🎨 **CSS 内联** - 样式自动注入到 Shadow DOM
- 🔧 **TypeScript 支持** - 完整的类型定义
- 📦 **标准构建** - 支持 ESM 和 CJS 格式
- 🚀 **响应式支持** - 可选使用响应式状态管理

## 安装

```bash
npm install @systembug/wsx-base-components
```

## 使用

```typescript
import { XyButton, ColorPicker, ThemeSwitcher } from '@systembug/wsx-base-components';

// 组件会自动注册到全局，可以直接使用
document.body.innerHTML = '<xy-button>Click me</xy-button>';
```

## 组件库构建配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { wsx } from '@systembug/wsx-vite-plugin';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'WSXBaseComponents',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@systembug/wsx-core'],
      output: {
        globals: {
          '@systembug/wsx-core': 'WSXCore',
        },
      },
    },
    cssCodeSplit: false, // 关键：禁用CSS代码分割，确保CSS内联到JS中
  },
  plugins: [
    wsx({
      debug: false,
      jsxFactory: 'jsx',
      jsxFragment: 'Fragment',
    }),
  ],
});
```

### Package.json 配置

```json
{
  "name": "@your-org/your-component-lib",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "dependencies": {
    "@systembug/wsx-core": "^0.0.5"
  },
  "devDependencies": {
    "@systembug/wsx-vite-plugin": "^0.0.5",
    "vite": "^5.4.19",
    "typescript": "^5.0.0"
  }
}
```

### 关键配置说明

1. **CSS 内联**: `cssCodeSplit: false` 确保 CSS 被内联到 JS 中，而不是输出到单独文件
2. **外部依赖**: 将 `@systembug/wsx-core` 标记为外部依赖，避免重复打包
3. **WSX 插件**: 使用 `@systembug/wsx-vite-plugin` 处理 `.wsx` 文件
4. **双格式输出**: 同时输出 ESM 和 CJS 格式，兼容不同环境

### 组件开发规范

1. **CSS 导入**: 使用 `import styles from './Component.css?inline'` 导入样式
2. **默认导出**: 组件类使用 `export default class ComponentName extends WebComponent`
3. **自动注册**: 使用 `@autoRegister({ tagName: 'component-name' })` 装饰器

### 示例组件

```typescript
// Component.wsx
/** @jsxImportSource @systembug/wsx-core */

import { WebComponent, autoRegister } from '@systembug/wsx-core';
import styles from './Component.css?inline';

@autoRegister({ tagName: 'my-component' })
export default class MyComponent extends WebComponent {
  constructor() {
    super({
      styles,
      styleName: 'my-component',
    });
  }

  render() {
    return (
      <div class="my-component">
        <h1>Hello WSX!</h1>
      </div>
    );
  }
}
```

## 构建输出

构建完成后，会生成以下文件：

```
dist/
├── index.js      # ESM 格式，CSS 内联
└── index.cjs     # CJS 格式，CSS 内联
```

**注意**: 没有单独的 CSS 文件，所有样式都已内联到 JS 中。

## 社区最佳实践

1. **组件设计**: 遵循 Web Components 标准，确保组件的独立性和可复用性
2. **样式隔离**: 利用 Shadow DOM 实现样式隔离，避免全局样式污染
3. **类型安全**: 提供完整的 TypeScript 类型定义
4. **文档完善**: 为每个组件提供使用示例和 API 文档
5. **测试覆盖**: 编写单元测试和集成测试

## 许可证

MIT 
