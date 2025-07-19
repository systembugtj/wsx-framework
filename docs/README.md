# WSX Framework 文档

欢迎来到 WSX Framework 文档中心！这里包含了框架的完整文档，从快速开始到高级特性。

## 📚 文档导航

### 🚀 快速开始
- **[快速开始指南](QUICK_START.md)** - 5分钟上手WSX Framework
- **[JSX支持详解](JSX_SUPPORT.md)** - 完整的JSX语法和特性说明

### 🎯 核心概念
- **[设计理念](DESIGN_PHILOSOPHY.md)** - WSX Framework的设计哲学和原生优先理念
- **[Web Components基础](WSX_DESIGN.md)** - Web Components标准介绍

### 🛠️ 开发指南
- **[Chrome调试指南](chrome-debugging-guide.md)** - 使用Chrome DevTools调试WSX组件
- **[实践计划](WSX_PRACTICE_PLAN.md)** - 系统性的学习计划
- **[独立开发模板](WSX_SOLO_DEV_TEMPLATE.md)** - 快速搭建开发环境

### 🔧 工具链
- **[ESLint插件](../packages/eslint-plugin/README.md)** - 代码质量检查
- **[Vite插件](../packages/vite-plugin/)** - 构建工具集成

### 📦 包结构
```
wsx-framework/
├── packages/
│   ├── core/           # 核心框架
│   ├── eslint-plugin/  # ESLint插件
│   ├── vite-plugin/    # Vite插件
│   └── examples/       # 示例项目
```

### 🎨 设计系统
- **[设计文档](design/)** - UI/UX设计指南和组件库

### 🔄 CI/CD
- **[CI/CD策略](CICD_STRATEGY.md)** - 持续集成和部署策略
- **[CI修复记录](CI_FIXES.md)** - 持续集成问题的解决方案
- **[GitHub规则集](GITHUB_RULESETS.md)** - 代码质量和安全规则

### 📋 项目管理
- **[实现总结](IMPLEMENTATION_SUMMARY.md)** - 项目实现状态总结
- **[框架重设计任务](wsx-framework-redesign-task.md)** - 重构计划

## 🎯 设计理念亮点

### 原生优先 (Native-First)
WSX Framework 采用原生优先的设计理念：

```jsx
// ✅ WSX - 使用原生HTML属性名
<div class="container">
  <button class="btn btn-primary">Click me</button>
</div>

// ❌ React - 使用JavaScript化的属性名  
<div className="container">
  <button className="btn btn-primary">Click me</button>
</div>
```

**核心优势**：
- 🚀 **更好的性能** - 无Virtual DOM开销
- 📦 **更小的体积** - 零依赖
- 🌐 **更好的兼容性** - 标准Web API
- 📚 **更简单的学习曲线** - 原生概念

## 🚀 快速体验

1. **安装**
   ```bash
   npm install @systembug/wsx-core
   ```

2. **创建组件**
   ```jsx
   import { WebComponent, h } from '@systembug/wsx-core';
   
   class MyButton extends WebComponent {
     render() {
       return <button class="btn" onClick={this.handleClick}>
         {this.text}
       </button>
     }
   }
   ```

3. **使用组件**
   ```html
   <my-button text="Click me"></my-button>
   ```

## 📖 深入学习

- 阅读 **[设计理念](DESIGN_PHILOSOPHY.md)** 了解框架哲学
- 查看 **[JSX支持](JSX_SUPPORT.md)** 掌握完整语法
- 实践 **[Chrome调试](chrome-debugging-guide.md)** 提升开发效率

## 🤝 贡献指南

欢迎贡献代码和文档！请查看：
- [贡献指南](../CONTRIBUTING.md)
- [GitHub规则集](GITHUB_RULESETS.md)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

---

**WSX Framework** - 回归原生，拥抱标准 🌟 
