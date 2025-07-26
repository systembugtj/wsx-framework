# WSX Framework - Claude Development Context

This file contains comprehensive information about the WSX Framework project to help Claude understand the codebase structure, development workflow, and technical details.

## Project Overview

WSX Framework is a modern Web Components framework that provides JSX syntax and TypeScript support for building native web components. It was extracted from the commando-tauri project and restructured as an independent monorepo under the `@wsxjs` organization.

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
│   ├── core/                    # @wsxjs/wsx-core
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
│   ├── vite-plugin/             # @wsxjs/wsx-vite-plugin
│   │   └── src/
│   │       ├── index.ts              # Main export
│   │       └── vite-plugin-wsx.ts    # Vite plugin implementation
│   │
│   ├── eslint-plugin/           # @wsxjs/eslint-plugin-wsx
│   │   └── src/
│   │       ├── index.ts              # Main export
│   │       ├── rules/                # ESLint rules for WSX
│   │       ├── configs/              # Recommended configurations
│   │       └── types.ts              # Type definitions
│   │
│   ├── components/              # @wsxjs/wsx-base-components
│   │   └── src/
│   │       ├── XyButton.wsx          # Button component implementation
│   │       ├── XyButtonGroup.wsx     # Button group container
│   │       ├── ColorPicker.wsx       # Color picker component
│   │       └── ColorPickerUtils.ts   # Utility functions
│   │
│   └── examples/                # @wsxjs/wsx-examples
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

### @wsxjs/wsx-core
The core framework package containing:
- `WebComponent`: Abstract base class for all WSX components
- `jsx`, `jsxs`, `Fragment`: JSX runtime implementation
- `autoRegister`: Decorator for automatic component registration
- `StyleManager`: CSS management for Shadow DOM
- `WSXLogger`, `createLogger`: Logging utilities

### @wsxjs/wsx-vite-plugin
Vite integration that:
- Processes .wsx files as TypeScript with JSX
- Auto-injects JSX factory imports (h, Fragment) when missing
- Handles CSS inline imports  
- Provides hot reload support
- **Professional test suite**: Unit tests and integration tests with Vite build scenarios
- **Comprehensive coverage**: Tests transformation, error handling, HMR, and performance

### @wsxjs/eslint-plugin-wsx
ESLint rules specifically for WSX development:
- **render-method-required**: Ensures WSX components implement required render() method
- **no-react-imports**: Prevents React imports in WSX files (framework uses its own JSX)
- **web-component-naming**: Validates Web Component naming conventions (hyphen required, no reserved names)
- **Professional test suite**: 38 tests with 100% code coverage using Jest + RuleTester
- **Integration testing**: Real-world validation in examples package

### @wsxjs/wsx-base-components
Pre-built UI components:
- `XyButton`: Feature-rich button with multiple styles and states
- `XyButtonGroup`: Container for grouping buttons
- `ColorPicker`: Advanced color selection component with custom picker support

### @wsxjs/wsx-examples
Example applications demonstrating framework usage:
- **Real-world testing environment**: Uses ESLint plugin configuration to validate framework rules
- **Interactive showcase**: App.wsx demonstrates all framework features
- **Component library**: XyButton, ColorPicker, XyButtonGroup examples
- **Development validation**: Ensures framework works correctly in production scenarios

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
pnpm --filter @wsxjs/wsx-core build
pnpm --filter @wsxjs/wsx-examples dev

# ESLint Plugin Testing
pnpm --filter @wsxjs/eslint-plugin-wsx test           # Run 38 tests
pnpm --filter @wsxjs/eslint-plugin-wsx test:coverage  # 100% coverage report
pnpm --filter @wsxjs/eslint-plugin-wsx test:watch     # Development mode

# Vite Plugin Testing
pnpm --filter @wsxjs/wsx-vite-plugin test             # Run plugin tests
pnpm --filter @wsxjs/wsx-vite-plugin test:coverage    # Coverage report
pnpm --filter @wsxjs/wsx-vite-plugin test:watch       # Development mode
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

#### IDE Support for JSX
To ensure proper IDE support and eliminate "This JSX tag requires 'React' to be in scope" errors:

1. **Add JSX pragma comment** to the top of your .wsx files:
   ```typescript
   /** @jsxImportSource @wsxjs/wsx-core */
   ```

2. **TypeScript configuration** should include:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "@wsxjs/wsx-core"
     }
   }
   ```

3. **VS Code file associations** (optional, add to .vscode/settings.json):
   ```json
   {
     "files.associations": {
       "*.wsx": "typescriptreact"
     }
   }
   ```

The pragma comment tells TypeScript and your IDE that JSX should use the WSX framework's JSX runtime instead of React's, providing proper IntelliSense and eliminating type errors.

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
- **Coverage reporting**: Comprehensive code coverage (100% for ESLint plugin)
- **Web Components mocking**: Custom elements and Shadow DOM mocks
- **ESLint RuleTester**: Professional ESLint plugin testing with AST node validation
- **Integration testing**: Real-world usage validation in examples package

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
/** @jsxImportSource @wsxjs/wsx-core */
import { WebComponent, autoRegister, createLogger } from '@wsxjs/wsx-core';
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
import { wsx } from '@wsxjs/wsx-vite-plugin';

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
Packages are scoped under `@wsxjs`:
- `@wsxjs/wsx-core`
- `@wsxjs/wsx-vite-plugin`
- `@wsxjs/eslint-plugin-wsx`
- `@wsxjs/wsx-base-components`

### CI/CD Pipeline
GitHub Actions workflow that:
- Runs on push to main/develop branches
- Tests on Node.js 16, 18, 20
- Runs linting, type checking, and tests
- Builds all packages
- Reports test coverage

## Troubleshooting

### Common Issues
1. **"This JSX tag requires 'React' to be in scope" IDE error**: 
   - Add `/** @jsxImportSource @wsxjs/wsx-core */` to the top of your .wsx file
   - Ensure tsconfig.json has `"jsx": "react-jsx"` and `"jsxImportSource": "@wsxjs/wsx-core"`
   - Restart TypeScript service in IDE: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

2. **Import errors**: Check TypeScript path mappings in tsconfig.json

3. **Build failures**: Ensure all workspace dependencies are properly linked

4. **Test failures**: Check Jest configuration and mocks

5. **Linting errors**: Run `pnpm lint:fix` to auto-fix issues

### Debug Mode
Enable debug logging by setting the log level:
```typescript
import { createLogger } from '@wsxjs/wsx-core';
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

- **Repository**: https://github.com/wsxjs/wsxjs
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for community questions
- **License**: MIT License

---

## ESLint Plugin Development

The WSX ESLint plugin follows professional testing practices:

### Test Architecture
```
packages/eslint-plugin/
├── __tests__/
│   ├── rules/                    # Individual rule tests
│   │   ├── render-method-required.test.ts
│   │   ├── no-react-imports.test.ts
│   │   └── web-component-naming.test.ts
│   ├── integration.test.ts       # Full plugin integration tests
│   └── setup.ts                  # Test environment setup
├── jest.config.js                # Jest configuration
└── README.md                     # Plugin documentation
```

### Testing Strategy
1. **Unit Tests**: Each rule tested with RuleTester using valid/invalid code examples
2. **Integration Tests**: Full ESLint configuration scenarios with real-world components
3. **Coverage Requirements**: 100% statement coverage, 96%+ branch coverage
4. **Real-world Validation**: examples package serves as live testing environment

### ESLint Rules Implementation
- **render-method-required**: AST analysis for WebComponent classes missing render() method
- **no-react-imports**: Import statement detection and auto-fix removal
- **web-component-naming**: @autoRegister decorator validation for custom element naming

### Development Commands
```bash
# ESLint Plugin Test Development
pnpm --filter @wsxjs/eslint-plugin-wsx test:watch
pnpm --filter @wsxjs/eslint-plugin-wsx test:coverage

# Vite Plugin Test Development  
pnpm --filter @wsxjs/wsx-vite-plugin test:watch
pnpm --filter @wsxjs/wsx-vite-plugin test:coverage

# Real-world validation
pnpm --filter @wsxjs/wsx-examples lint     # ESLint plugin validation
pnpm --filter @wsxjs/wsx-examples dev      # Vite plugin validation
```

## Framework Development Best Practices

### Dual Testing Approach
1. **Professional Test Suite**: Jest + RuleTester for comprehensive rule validation
2. **Real Environment Testing**: examples package as living integration test

### Test File Organization
- **`__tests__/`**: Test files associated with source files (excluded from npm publish)
- **`test/`**: Test configuration and setup files (excluded from npm publish)
- **Pattern**: `src/__tests__/component.test.ts` tests `src/component.ts`

### Publishing Configuration
All packages properly exclude test files from npm publish:
```json
{
  "files": [
    "dist",
    "src", 
    "!**/__tests__",
    "!**/test"
  ]
}
```

### Quality Assurance
- Fixed CJS deprecation warnings in Vite development server
- 100% ESLint plugin test coverage with professional test architecture
- Comprehensive Vite plugin testing with unit and integration tests
- Examples package validates framework usability in real development scenarios
- Auto JSX injection eliminates developer boilerplate

## RFC

All RFC doc is located at docs/rfc

---

This document should be updated as the project evolves. Last updated: 2025-01-15
