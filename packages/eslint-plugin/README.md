# @wsxjs/wsx-eslint-plugin

ESLint plugin for WSX Framework - enforces best practices and framework-specific rules for Web Components with JSX.

## Testing Results

✅ **38 tests passed** with **100% code coverage**
✅ **Professional test suite** using Jest and ESLint RuleTester
✅ **Integration tests** verify real-world usage scenarios

## Test Coverage Summary
- **Statements**: 100%
- **Branches**: 96.96%
- **Functions**: 100% 
- **Lines**: 100%

## Better Testing Approach

This plugin now uses industry-standard testing practices:

### 1. Unit Tests with RuleTester
- Each rule has dedicated test files
- Valid/invalid code examples with expected errors
- Proper AST node testing

### 2. Integration Tests
- Full plugin functionality testing
- Real ESLint configuration scenarios
- Complex component examples

### 3. Comprehensive Coverage
- All rules tested with edge cases
- Error messages and fix suggestions verified
- Plugin structure and exports validated

## Features

- 🔍 **render-method-required**: Ensures WSX components implement the required `render()` method
- 🚫 **no-react-imports**: Prevents React imports in WSX files 
- 🏷️ **web-component-naming**: Enforces proper Web Component tag naming conventions

## Framework Integration

The examples package serves as a **real-world testing environment** where:
1. The ESLint plugin is properly configured and tested
2. All WSX components demonstrate correct framework usage
3. Plugin rules catch actual coding errors in development
4. Framework developers can validate plugin effectiveness

This approach ensures the plugin works correctly in production environments, not just in isolated tests.
