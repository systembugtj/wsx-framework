# WSX Framework 快速开始指南

## 安装

```bash
npm install @systembug/wsx-core @systembug/wsx-vite-plugin @systembug/eslint-plugin-wsx
```

## 配置

### 1. TypeScript 配置

在 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@systembug/wsx-core/jsx"
  }
}
```

### 2. Vite 配置

在 `vite.config.ts` 中添加：

```typescript
import { defineConfig } from 'vite';
import { wsx } from '@systembug/wsx-vite-plugin';

export default defineConfig({
  plugins: [wsx()]
});
```

### 3. ESLint 配置

在 `eslint.config.js` 中添加：

```javascript
import wsxPlugin from '@systembug/eslint-plugin-wsx';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx,wsx}'],
    plugins: { wsx: wsxPlugin },
    rules: {
      'wsx/no-react-imports': 'error',
      'wsx/render-method-required': 'error'
    }
  }
];
```

## 创建组件

```typescript
// MyButton.wsx
import { WebComponent, autoRegister } from '@systembug/wsx-core';
import styles from './MyButton.css?inline';

@autoRegister('my-button')
export class MyButton extends WebComponent {
  constructor() {
    super({ styles });
  }

  render() {
    return (
      <button className="btn" onClick={(e) => this.handleClick(e)}>
        <slot />
      </button>
    );
  }

  private handleClick = (event: MouseEvent) => {
    console.log('Button clicked!');
  };
}
```

## 使用组件

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="./main.ts"></script>
</head>
<body>
  <my-button>Click me!</my-button>
</body>
</html>
```

## 主要特性

- ✅ **零 React 依赖**：完全独立的 JSX 实现
- ✅ **框架级支持**：无需额外配置
- ✅ **TypeScript 支持**：完整的类型安全
- ✅ **Web Components**：原生自定义元素
- ✅ **CSS 封装**：Shadow DOM 样式隔离

## 下一步

查看 [JSX 支持文档](JSX_SUPPORT.md) 了解更多高级用法。 
