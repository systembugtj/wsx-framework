# WSX Framework (@systembug)

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

## Packages

### Published Packages
- **@systembug/wsx-core** - Core framework with WebComponent base class, JSX factory, logger, and utilities
- **@systembug/wsx-vite-plugin** - Vite integration for .wsx files (auto-injects JSX factory)
- **@systembug/wsx-eslint-plugin** - ESLint rules for WSX components

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
```

## Creating a WSX Component

```tsx
// MyComponent.wsx
import { WebComponent, autoRegister, createLogger } from '@systembug/wsx-core';
import styles from './MyComponent.css?inline';

const logger = createLogger('MyComponent');

// No need to import h or Fragment - Vite plugin auto-injects them!
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
- **Auto JSX Injection**: The Vite plugin automatically injects `h` and `Fragment` imports
- **Clean Imports**: Focus on your component logic, not boilerplate
- **TypeScript Support**: Full IntelliSense and type safety
- **CSS Encapsulation**: Import CSS with `?inline` for Shadow DOM styling

## Usage in HTML

```html
<my-component>
  <p>This content goes in the slot</p>
</my-component>
```

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
├── test/                  # Global test setup
├── .github/              # GitHub Actions CI/CD
└── docs/                 # Documentation
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
