/**
 * Jest setup file for @systembug/wsx-vite-plugin tests
 */

// Global test setup
beforeAll(() => {
    // Setup before all tests
});

afterAll(() => {
    // Cleanup after all tests
});

// Mock console if needed
global.console = {
    ...console,
    // Suppress debug logs during tests unless explicitly testing them
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
