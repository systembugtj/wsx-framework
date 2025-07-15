# ESLint Plugin WSX

专为 WSX (Web Components JSX) 框架设计的 ESLint 插件，提供最佳实践规则和配置。

## 特性

- 🚫 **防止 React 混用** - 自动检测并禁止 React 导入
- ⚡ **强制最佳实践** - 确保组件实现 render 方法
- 🎯 **自动修复** - 支持自动导入 h 函数和 Fragment
- 📏 **命名约定** - 强制执行 Web Components 命名规范
- 🔧 **开箱即用** - 提供 recommended 配置预设

## 安装

插件作为 WSX 框架的一部分，无需单独安装。

## 配置

### 推荐配置

在你的 ESLint 配置中使用 WSX 推荐设置：

```javascript
// eslint.config.js
import wsxPlugin from "./src/components/editorjs-tools/base/eslint-plugin-wsx";

export default [
    {
        files: ["**/*.wsx"],
        plugins: {
            wsx: wsxPlugin,
        },
        ...wsxPlugin.configs.recommended,
    },
];
```

### 自定义配置

```javascript
{
    files: ["**/*.wsx"],
    plugins: {
        wsx: wsxPlugin,
    },
    rules: {
        "wsx/render-method-required": "error",
        "wsx/no-react-imports": "error",
        "wsx/valid-jsx-pragma": "warn",
        "wsx/web-component-naming": ["warn", {
            tagNamePattern: "^my-[a-z0-9-]+$",
            requireHyphen: true,
        }],
    },
}
```

## 规则

### `wsx/render-method-required`

确保所有 WSX 组件都实现了 `render` 方法。

❌ **错误示例**:
```typescript
class MyComponent extends WebComponent {
    // 缺少 render 方法
}
```

✅ **正确示例**:
```typescript
class MyComponent extends WebComponent {
    render(): HTMLElement {
        return <div>Hello World</div>;
    }
}
```

### `wsx/no-react-imports`

禁止在 WSX 文件中导入 React 相关模块。

❌ **错误示例**:
```typescript
import React from "react";
import { useState } from "react";
```

✅ **正确示例**:
```typescript
import { h } from "../base/jsx-factory";
```

### `wsx/valid-jsx-pragma`

验证 JSX pragma 设置，自动导入必要的函数。

❌ **错误示例**:
```typescript
// 缺少 h 函数导入
class MyComponent extends WebComponent {
    render() {
        return <div>Hello</div>; // 错误：未导入 h
    }
}
```

✅ **正确示例**:
```typescript
import { h } from "../base/jsx-factory";

class MyComponent extends WebComponent {
    render() {
        return <div>Hello</div>;
    }
}
```

### `wsx/web-component-naming`

强制执行 Web Components 命名约定。

❌ **错误示例**:
```typescript
@autoRegister({ tagName: "div" }) // 与 HTML 元素冲突
class MyComponent extends WebComponent {}

@autoRegister({ tagName: "mycomponent" }) // 缺少连字符
class MyComponent extends WebComponent {}
```

✅ **正确示例**:
```typescript
@autoRegister({ tagName: "my-component" })
class MyComponent extends WebComponent {}
```

#### 选项

- `classNamePattern`: 类名正则表达式 (默认: `^[A-Z][a-zA-Z0-9]*$`)
- `tagNamePattern`: 标签名正则表达式 (默认: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`)
- `requireHyphen`: 是否要求标签名包含连字符 (默认: `true`)

## 最佳实践

1. **使用推荐配置** - 开始时使用 `recommended` 配置
2. **逐步定制** - 根据项目需求调整规则
3. **自动修复** - 运行 `eslint --fix` 自动修复可修复的问题
4. **CI 集成** - 在持续集成中运行 ESLint 检查

## 与现有配置集成

WSX 插件设计为与现有 ESLint 配置无缝集成：

```javascript
export default [
    // 通用 TypeScript 配置
    {
        files: ["**/*.{ts,js}"],
        // ... 通用规则
    },
    
    // React 文件配置
    {
        files: ["**/*.{tsx,jsx}"],
        // ... React 规则
    },
    
    // WSX 文件配置
    {
        files: ["**/*.wsx"],
        plugins: { wsx: wsxPlugin },
        ...wsxPlugin.configs.recommended,
    },
];
```

## 故障排除

### 规则不生效

确保：
1. 文件匹配模式包含 `.wsx` 文件
2. 插件正确导入和注册
3. 规则配置正确

### 自动修复不工作

某些规则支持自动修复，运行：
```bash
eslint --fix "**/*.wsx"
```

### 与其他插件冲突

WSX 插件设计为独立运行，如果遇到冲突：
1. 检查规则优先级
2. 使用文件匹配模式分离配置
3. 禁用冲突的规则

## 许可证

MIT