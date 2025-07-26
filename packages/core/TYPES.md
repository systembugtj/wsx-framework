# WSX Core 类型系统

## 类型合并解决方案

### 问题描述
原始问题：package.json中的`types`字段指向`./dist/index.d.ts`，但实际类型定义分散在多个文件中，导致类型无法正确合并。

### 解决方案

#### 1. 类型文件结构
```
packages/core/types/
├── index.d.ts          # 主类型入口文件
├── global.d.ts         # 全局类型声明
├── wsx-types.d.ts      # JSX相关类型
├── css-inline.d.ts     # CSS模块类型
└── jsx-runtime.d.ts    # JSX运行时类型
```

#### 2. 类型合并策略

**主入口文件** (`types/index.d.ts`):
- 导入所有类型定义文件
- 重新导出所有公共API
- 确保类型正确合并

**全局类型** (`types/global.d.ts`):
- 声明全局JSX命名空间
- 确保JSX语法支持

**模块类型** (`types/wsx-types.d.ts`):
- 声明WSX文件模块
- 定义JSX工厂函数类型

#### 3. Package.json配置

```json
{
  "types": "./types/index.d.ts",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

### 导出的类型

#### 核心类型
- `WebComponent` - 基础Web组件类
- `WebComponentConfig` - 组件配置接口

#### JSX相关
- `h` - JSX工厂函数
- `Fragment` - JSX片段
- `JSXChildren` - JSX子元素类型

#### 装饰器相关
- `autoRegister` - 自动注册装饰器
- `registerComponent` - 组件注册函数
- `AutoRegistrationOptions` - 注册选项接口

#### 样式管理
- `StyleManager` - 样式管理器类

#### 日志系统
- `WSXLogger` - 日志器类
- `createLogger` - 创建日志器函数
- `Logger` - 日志器接口
- `LogLevel` - 日志级别类型

### 使用示例

```typescript
import { 
    WebComponent, 
    type WebComponentConfig,
    autoRegister,
    h,
    Fragment 
} from "@wsxjs/wsx-core";

@autoRegister({ tagName: "my-component" })
class MyComponent extends WebComponent {
    constructor() {
        super({ styles: "div { color: red; }" });
    }

    render(): HTMLElement {
        return h("div", { class: "my-component" }, [
            h("h1", {}, "Hello"),
            Fragment({}, [h("p", {}, "World")])
        ]);
    }
}
```

### 验证方法

1. **类型检查**:
   ```bash
   npm run typecheck
   ```

2. **构建验证**:
   ```bash
   npm run build
   ```

3. **消费者测试**:
   ```bash
   cd ../examples
   npx tsc --noEmit
   ```

### 注意事项

1. 避免重复的模块声明
2. 确保全局类型正确声明
3. 保持类型文件的一致性
4. 定期验证类型导出 
