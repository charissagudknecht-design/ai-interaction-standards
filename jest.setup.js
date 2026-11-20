/**
 * Jest Setup
 * Global setup for all tests
 */

// Import testing library matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
});

// Custom Element Registry mock for JSDOM
if (!customElements.get) {
    const registry = new Map();
    
    window.customElements = {
        get: (name) => registry.get(name),
        define: (name, constructor) => {
            if (registry.has(name)) {
                console.warn(`Custom element ${name} already defined`);
                return;
            }
            registry.set(name, constructor);
        },
        whenDefined: (name) => {
            return new Promise((resolve) => {
                if (registry.has(name)) {
                    resolve(registry.get(name));
                }
            });
        },
    };
}

// Console error/warning suppression for known issues
const originalError = console.error;
console.error = (...args) => {
    // Suppress React 18 act warnings in tests
    if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) {
        return;
    }
    originalError.apply(console, args);
};
