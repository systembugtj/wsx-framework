# WSX Framework - Claude Development Context

This file contains comprehensive information about the WSX Framework project to help Claude understand the codebase structure, development workflow, and technical details.

## Project Overview

WSX Framework is a modern Web Components framework that provides JSX syntax and TypeScript support for building native web components. It was extracted from the commando-tauri project and restructured as an independent monorepo under the `@systembug` organization.

### Key Features
- Zero React dependency - pure native Web Components
- JSX syntax with custom factory implementation
- TypeScript-first development experience
- Decorator-based auto-registration for components
- Shadow DOM with CSS-in-JS support
- Built-in logging system
- Comprehensive development tooling

## Monorepo Structure

```
wsx-framework/
├── packages/
│   ├── core/                    # @systembug/wsx-core
│   │   ├── src/
│   │   │   ├── WebComponent.ts       # Abstract base class for all WSX components
│   │   │   ├── jsx-factory.ts        # Zero-dependency JSX implementation
│   │   │   ├── auto-register.ts      # Decorator-based component registration
│   │   │   ├── logger.ts             # Built-in logging utilities
│   │   │   ├── styles/
│   │   │   │   └── StyleManager.ts   # CSS management for Shadow DOM
│   │   │   └── wsx-types.d.ts        # TypeScript declarations
│   │   └── __tests__/               # Jest test files
│   │
│   ├── vite-plugin/             # @systembug/wsx-vite-plugin
│   │   └── src/
│   │       ├── index.ts              # Main export
│   │       └── vite-plugin-wsx.ts    # Vite plugin implementation
│   │
│   ├── eslint-plugin/           # @systembug/wsx-eslint-plugin
│   │   └── src/
│   │       ├── index.ts              # Main export
│   │       ├── rules/                # ESLint rules for WSX
│   │       ├── configs/              # Recommended configurations
│   │       └── types.ts              # Type definitions
│   │
│   ├── components/              # @systembug/wsx-components
│   │   └── src/
│   │       ├── XyButton.wsx          # Button component implementation
│   │       ├── XyButtonGroup.wsx     # Button group container
│   │       ├── ColorPicker.wsx       # Color picker component
│   │       └── ColorPickerUtils.ts   # Utility functions
│   │
│   └── examples/                # @systembug/wsx-examples
│       ├── src/
│       │   └── main.ts               # Example application
│       ├── index.html                # HTML entry point
│       └── vite.config.ts            # Vite configuration
│
├── test/                        # Global test configuration
│   ├── setup.ts                     # Jest setup and mocks
│   └── __mocks__/                   # Mock implementations
│
├── .github/                     # GitHub Actions CI/CD
│   └── workflows/
│       └── ci.yml                   # Continuous integration workflow
│
├── .husky/                      # Git hooks
│   └── pre-commit                   # Pre-commit hook
│
├── package.json                 # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
├── tsconfig.json               # Root TypeScript configuration
├── jest.config.js              # Jest test configuration
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Prettier formatting rules
├── .gitignore                 # Git ignore patterns
├── README.md                  # Project documentation
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT license
└── CLAUDE.md                  # This file
```

## Package Details

### @systembug/wsx-core
The core framework package containing:
- `WebComponent`: Abstract base class for all WSX components
- `jsx`, `jsxs`, `Fragment`: JSX runtime implementation
- `autoRegister`: Decorator for automatic component registration
- `StyleManager`: CSS management for Shadow DOM
- `WSXLogger`, `createLogger`: Logging utilities

### @systembug/wsx-vite-plugin
Vite integration that:
- Processes .wsx files as TypeScript with JSX
- Injects proper JSX pragma for WSX components
- Handles CSS inline imports
- Provides hot reload support

### @systembug/wsx-eslint-plugin
ESLint rules specifically for WSX development:
- Prevents React imports in WSX files
- Enforces render method implementation
- Validates Web Component naming conventions

### @systembug/wsx-components
Pre-built UI components:
- `XyButton`: Feature-rich button with multiple styles and states
- `XyButtonGroup`: Container for grouping buttons
- `ColorPicker`: Advanced color selection component with custom picker support

### @systembug/wsx-examples
Example applications demonstrating framework usage.

## Development Workflow

### Prerequisites
- Node.js 18+ (recommended)
- pnpm 8+
- Git

### Common Commands

```bash
# Development
pnpm install              # Install all dependencies
pnpm build               # Build all packages
pnpm dev                 # Start development with watch mode
pnpm clean               # Clean all build artifacts

# Testing
pnpm test                # Run all tests
pnpm test:coverage       # Run tests with coverage
pnpm test:watch         # Run tests in watch mode

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues automatically
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
pnpm typecheck          # Run TypeScript type checking

# Specific Package Commands
pnpm --filter @systembug/wsx-core build
pnpm --filter @systembug/wsx-examples dev
```

### File Naming Conventions
- `.wsx` files: WSX components (TypeScript + JSX)
- `.ts` files: Regular TypeScript files
- `.test.ts` files: Jest test files
- `.d.ts` files: TypeScript declarations
- `.css` files: Stylesheets (imported as `?inline` for components)

## Technical Architecture

### Component Lifecycle
```typescript
@autoRegister()
export class MyComponent extends WebComponent {
  // 1. Constructor - Initialize component state
  constructor() {
    super({ styles });
  }

  // 2. render() - Required JSX method
  render(): HTMLElement {
    return <div>Content</div>;
  }

  // 3. connectedCallback - Component mounted to DOM
  protected onConnected?(): void {
    // Component initialization
  }

  // 4. disconnectedCallback - Component removed from DOM
  protected onDisconnected?(): void {
    // Cleanup
  }

  // 5. attributeChangedCallback - Attributes changed
  protected onAttributeChanged?(name: string, oldValue: string, newValue: string): void {
    // Handle attribute changes
  }
}
```

### JSX Implementation
- Custom JSX factory function that creates native DOM elements
- No React dependency required
- Support for event handlers, refs, and all standard HTML attributes
- Fragment support for multiple root elements

### Auto-Registration System
- `@autoRegister()` decorator automatically registers components
- Converts PascalCase class names to kebab-case tag names
- Prevents duplicate registrations
- Supports custom tag names and prefixes

### Style Management
- Uses Constructable StyleSheets for performance
- CSS caching across component instances
- Shadow DOM encapsulation
- Fallback support for older browsers

## Development Tools

### Code Quality
- **ESLint**: TypeScript and code quality enforcement
- **Prettier**: Consistent code formatting
- **EditorConfig**: Cross-editor consistency
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters only on changed files

### Testing
- **Jest**: Test runner with jsdom environment
- **@testing-library/jest-dom**: DOM testing utilities
- **Coverage reporting**: Comprehensive code coverage
- **Web Components mocking**: Custom elements and Shadow DOM mocks

### Build System
- **tsup**: Fast TypeScript bundler
- **pnpm workspaces**: Efficient monorepo management
- **TypeScript project references**: Optimized builds
- **Dual package exports**: Both CJS and ESM support

### VS Code Integration
- Auto-format on save
- ESLint integration with auto-fix
- TypeScript IntelliSense
- File associations for .wsx files
- Recommended extensions

## Common Patterns

### Creating a New Component
```typescript
// MyButton.wsx
import { WebComponent, autoRegister, createLogger } from '@systembug/wsx-core';
import styles from './MyButton.css?inline';

const logger = createLogger('MyButton');

@autoRegister()
export class MyButton extends WebComponent {
  constructor() {
    super({ styles });
    logger.info('MyButton initialized');
  }

  render() {
    return (
      <button 
        class="my-button"
        onClick={this.handleClick}
      >
        <slot></slot>
      </button>
    );
  }

  private handleClick = (event: Event) => {
    logger.debug('Button clicked');
    // Handle click logic
  };
}
```

### Using Components
```html
<my-button>Click me!</my-button>
```

### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import { wsx } from '@systembug/wsx-vite-plugin';

export default defineConfig({
  plugins: [wsx()],
});
```

## Build and Deployment

### Package Building
Each package builds to a `dist/` directory with:
- `index.js` - CommonJS build
- `index.mjs` - ES modules build
- `index.d.ts` - TypeScript declarations
- `index.css` - Bundled styles (for components package)

### NPM Publishing
Packages are scoped under `@systembug`:
- `@systembug/wsx-core`
- `@systembug/wsx-vite-plugin`
- `@systembug/wsx-eslint-plugin`
- `@systembug/wsx-components`

### CI/CD Pipeline
GitHub Actions workflow that:
- Runs on push to main/develop branches
- Tests on Node.js 16, 18, 20
- Runs linting, type checking, and tests
- Builds all packages
- Reports test coverage

## Troubleshooting

### Common Issues
1. **Import errors**: Check TypeScript path mappings in tsconfig.json
2. **Build failures**: Ensure all workspace dependencies are properly linked
3. **Test failures**: Check Jest configuration and mocks
4. **Linting errors**: Run `pnpm lint:fix` to auto-fix issues

### Debug Mode
Enable debug logging by setting the log level:
```typescript
import { createLogger } from '@systembug/wsx-core';
const logger = createLogger('Component', true, 'debug');
```

### VS Code Setup
Install recommended extensions:
- ESLint
- Prettier
- EditorConfig
- TypeScript and JavaScript Language Features

## Future Roadmap

### Planned Features
- Server-side rendering support
- Component composition patterns
- Advanced state management
- Performance monitoring tools
- Additional pre-built components
- Documentation site generation

### Contributing
See CONTRIBUTING.md for detailed contribution guidelines including:
- Development setup
- Coding standards
- Testing requirements
- Pull request process
- Commit conventions

## Resources

- **Repository**: https://github.com/systembug/wsx-framework
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for community questions
- **License**: MIT License

---

This document should be updated as the project evolves. Last updated: 2024-07-15