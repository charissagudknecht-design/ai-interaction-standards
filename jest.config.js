/**
 * Jest Configuration
 * Configuration for running unit tests
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Module file extensions
    moduleFileExtensions: ['ts', 'js', 'json'],

    // Transform files
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },

    // Module name mapping
    moduleNameMapper: {
        // Handle CSS imports
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
        
        // Handle path aliases
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    },

    // Test match patterns
    testMatch: [
        '<rootDir>/src/**/*.test.{ts,js}',
        '<rootDir>/src/**/*.spec.{ts,js}',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,js}',
        '!src/types/**/*',
        '!src/index.ts',
        '!src/index.webcomponents.ts',
        '!src/stories/**/*',
        '!src/components/base/**/*',
    ],

    coverageThreshold: {
        global: {
            branches: 50,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'html'],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Detect open handles
    detectOpenHandles: true,
};
