/**
 * Babel Configuration
 * Supports TypeScript and modern JavaScript (for Jest and tooling)
 */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
