# WSX Framework (@systembug)

[![npm version](https://badge.fury.io/js/@systembug%2Fwsx-core.svg)](https://badge.fury.io/js/@systembug%2Fwsx-core)
[![npm downloads](https://img.shields.io/npm/dm/@systembug/wsx-core.svg)](https://www.npmjs.com/package/@systembug/wsx-core)
[![CI Status](https://github.com/systembugtj/wsx-framework/workflows/CI/badge.svg)](https://github.com/systembugtj/wsx-framework/actions)
[![Coverage Status](https://codecov.io/gh/systembugtj/wsx-framework/branch/main/graph/badge.svg)](https://codecov.io/gh/systembugtj/wsx-framework)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern Web Components framework with JSX syntax and TypeScript support, published under the `@systembug` organization.

## Features

- 🚀 **Zero React Dependency** - Pure native Web Components with JSX syntax
- 📦 **TypeScript First** - Full type safety and IntelliSense support
- 🎨 **CSS-in-JS** - Scoped styles with Shadow DOM
- 🔧 **Build Tool Integration** - Vite plugin for seamless development
- 🎯 **Auto Registration** - Decorator-based component registration
- 📝 **Developer Experience** - ESLint rules and hot reload support
- 🧪 **Testing Ready** - Jest setup with Web Components mocking
- 🔍 **Code Quality** - ESLint, Prettier, and pre-commit hooks
- ⚡ **Framework-Level JSX Support** - Complete JSX support without React dependency

## Packages

### Published Packages

#### @systembug/wsx-core
[![npm version](https://badge.fury.io/js/@systembug%2Fwsx-core.svg)](https://badge.fury.io/js/@systembug%2Fwsx-core)
[![npm downloads](https://img.shields.io/npm/dm/@systembug/wsx-core.svg)](https://www.npmjs.com/package/@systembug/wsx-core)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@systembug/wsx-core.svg)](https://bundlephobia.com/result?p=@systembug/wsx-core)

Core framework with WebComponent base class, JSX factory, logger, and utilities

#### @systembug/wsx-vite-plugin
[![npm version](https://badge.fury.io/js/@systembug%2Fwsx-vite-plugin.svg)](https://badge.fury.io/js/@systembug%2Fwsx-vite-plugin)
[![npm downloads](https://img.shields.io/npm/dm/@systembug/wsx-vite-plugin.svg)](https://www.npmjs.com/package/@systembug/wsx-vite-plugin)
[![vite compatibility](https://img.shields.io/badge/vite-%3E%3D4.0.0-blueviolet.svg)](https://vitejs.dev/)

Vite integration for .wsx files (auto-injects JSX factory)

#### @systembug/wsx-eslint-plugin
[![npm version](https://badge.fury.io/js/@systembug%2Fwsx-eslint-plugin.svg)](https://badge.fury.io/js/@systembug%2Fwsx-eslint-plugin)
[![npm downloads](https://img.shields.io/npm/dm/@systembug/wsx-eslint-plugin.svg)](https://www.npmjs.com/package/@systembug/wsx-eslint-plugin)
[![eslint compatibility](https://img.shields.io/badge/eslint-%3E%3D8.0.0-orange.svg)](https://eslint.org/)

ESLint rules for WSX components

### Development Package
- **@systembug/wsx-examples** - Interactive showcase application with example components

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run examples
pnpm --filter @systembug/wsx-examples dev

# Run tests
pnpm test

# Start development with watch mode
pnpm dev

# Debug with Chrome DevTools
pnpm debug:wsx
```

## Creating a WSX Component

```tsx
// MyComponent.wsx
import { WebComponent, autoRegister, createLogger } from '@systembug/wsx-core';
import styles from './MyComponent.css?inline';

const logger = createLogger('MyComponent');

// Framework-level JSX support - no React dependency needed!
@autoRegister("my-component")
export class MyComponent extends WebComponent {
  constructor() {
    super({ styles });
    logger.info('MyComponent initialized');
  }

  render() {
    return (
      <div class="my-component">
        <h1>Hello WSX!</h1>
        <slot></slot>
      </div>
    );
  }
}
```

### Key Features
- **Framework-Level JSX Support**: Complete JSX support without React dependency
- **TypeScript Integration**: Full IntelliSense and type safety with `jsxImportSource`
- **Auto JSX Injection**: The Vite plugin automatically injects `h` and `Fragment` imports
- **Clean Imports**: Focus on your component logic, not boilerplate
- **CSS Encapsulation**: Import CSS with `?inline` for Shadow DOM styling

## JSX Configuration

WSX Framework provides framework-level JSX support. Configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@systembug/wsx-core/jsx"
  }
}
```

This enables complete JSX support without any React dependency!

## Usage in HTML

```html
<my-component>
  <p>This content goes in the slot</p>
</my-component>
```

## Documentation

- [Quick Start Guide](docs/QUICK_START.md) - Get started with WSX Framework in minutes
- [JSX Support Guide](docs/JSX_SUPPORT.md) - Complete guide to JSX configuration and usage
- [Design Documentation](docs/WSX_DESIGN.md) - Framework architecture and design decisions
- [Development Plan](docs/WSX_PRACTICE_PLAN.md) - Development workflow and best practices
- [Chrome Debugging Guide](docs/chrome-debugging-guide.md) - Debug Web Components with Chrome DevTools

## Development

This monorepo uses pnpm workspaces with comprehensive development tooling:

### Prerequisites

- Node.js 16+ (18+ recommended)
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/systembug/wsx-framework.git
cd wsx-framework

# Install dependencies
pnpm install
```

### Development Scripts

```bash
# Build all packages
pnpm build

# Development with watch mode
pnpm dev

# Chrome debugging
pnpm debug:chrome        # Start Chrome in debug mode
pnpm debug:wsx           # Start WSX app + Chrome debug mode

# Testing
pnpm test                 # Run all tests
pnpm test:coverage        # Run tests with coverage
pnpm test:watch          # Run tests in watch mode

# Code Quality
pnpm lint                # Run ESLint
pnpm lint:fix            # Fix ESLint issues automatically
pnpm format              # Format code with Prettier
pnpm format:check        # Check code formatting
pnpm typecheck           # Run TypeScript type checking

# Maintenance
pnpm clean               # Clean all build artifacts
```

### Project Structure

```
wsx-framework/
├── packages/
│   ├── core/              # Core framework
│   │   ├── src/
│   │   │   ├── WebComponent.ts     # Base component class
│   │   │   ├── jsx-factory.ts      # JSX runtime
│   │   │   ├── auto-register.ts    # Auto-registration
│   │   │   ├── logger.ts           # Logging utilities
│   │   │   └── styles/             # Style management
│   │   └── __tests__/             # Test files
│   ├── vite-plugin/       # Vite integration
│   ├── eslint-plugin/     # ESLint rules
│   ├── components/        # Pre-built components
│   └── examples/          # Example applications
├── scripts/               # Development scripts
│   └── debug-chrome.js    # Chrome debugging script
├── docs/                  # Documentation
│   └── chrome-debugging-guide.md  # Chrome debugging guide
├── test/                  # Global test setup
└── .github/              # GitHub Actions CI/CD
```

### Development Tooling

#### Code Quality
- **ESLint** - TypeScript and code quality rules
- **Prettier** - Code formatting
- **EditorConfig** - Cross-editor consistency
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files only

#### Testing
- **Jest** - Test runner with jsdom environment
- **@testing-library/jest-dom** - DOM testing utilities
- **Coverage** - Code coverage reporting
- **Web Components Mocking** - Custom elements and Shadow DOM mocks

#### Build System
- **tsup** - Fast TypeScript bundler
- **TypeScript** - Type checking and compilation
- **pnpm workspaces** - Monorepo package management

#### Debugging
- **Chrome DevTools** - Web Components debugging with Shadow DOM inspection
- **Browser Tools MCP** - Model Context Protocol integration for AI-assisted debugging
- **Remote Debugging** - Chrome remote debugging on port 9222

### VS Code Setup

The project includes VS Code configuration for optimal development experience:

- Auto-format on save
- ESLint integration
- TypeScript support
- File associations for `.wsx` files
- Recommended extensions

### Git Hooks

Pre-commit hooks automatically run:
- ESLint with auto-fix
- Prettier formatting
- TypeScript type checking

### Continuous Integration

GitHub Actions workflow includes:
- Linting and formatting checks
- TypeScript compilation
- Test execution with coverage
- Multi-version Node.js testing (16, 18, 20)

## Architecture

### Core Concepts

1. **WebComponent Base Class** - Abstract base for all WSX components
2. **JSX Factory** - Zero-dependency JSX implementation
3. **Auto Registration** - Decorator-based component registration
4. **Style Management** - Efficient CSS handling with Shadow DOM
5. **Logging** - Built-in logging system for debugging

### Component Lifecycle

```tsx
@autoRegister()
export class MyComponent extends WebComponent {
  // 1. Constructor - Component initialization
  constructor() {
    super({ styles });
  }

  // 2. render() - JSX rendering (required)
  render() {
    return <div>Content</div>;
  }

  // 3. connectedCallback - Component mounted
  protected onConnected() {
    // Component is in DOM
  }

  // 4. disconnectedCallback - Component unmounted
  protected onDisconnected() {
    // Cleanup
  }

  // 5. attributeChangedCallback - Attributes changed
  protected onAttributeChanged(name: string, oldValue: string, newValue: string) {
    // Handle attribute changes
  }
}
```

## Installation

To use WSX Framework in your project:

```bash
# Install core framework
npm install @systembug/wsx-core

# Install additional packages as needed
npm install @systembug/wsx-components
npm install @systembug/wsx-vite-plugin
npm install @systembug/wsx-eslint-plugin
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint:fix`
6. Commit changes: `git commit -m "feat: add my feature"`
7. Push to the branch: `git push origin feature/my-feature`
8. Submit a pull request

### Commit Convention

We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

## License

MIT

## Package Information

All packages are published under the `@systembug` npm organization:

- Core: `npm install @systembug/wsx-core`
- Vite Plugin: `npm install @systembug/wsx-vite-plugin` 
- ESLint Plugin: `npm install @systembug/wsx-eslint-plugin`
- Components: `npm install @systembug/wsx-components`

## Links

- **Repository**: https://github.com/systembug/wsx-framework
- **Issues**: https://github.com/systembug/wsx-framework/issues
- **NPM Organization**: https://www.npmjs.com/org/systembug

## Credits

Built with ❤️ by the WSX Framework team.

## Project Context

For comprehensive technical documentation and development context, see [CLAUDE.md](./CLAUDE.md) which contains detailed architecture information, development workflows, and troubleshooting guides.
