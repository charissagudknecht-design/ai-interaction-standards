# Architecture — zen-style Design System

## Overview

zen-style is a framework-agnostic Web Components library built with TypeScript and SCSS. Components register as native custom elements and work with any framework (React, Angular, Vue) or plain HTML.

## Project Structure

```
zen-style/
├── src/
│   ├── index.ts                    # npm entry point (CJS + ESM)
│   ├── index.webcomponents.ts      # browser entry point (ESM + IIFE)
│   ├── components/
│   │   ├── base/
│   │   │   └── ZenElement.ts       # Base class — all components extend this
│   │   └── [Name]/
│   │       ├── Zen[Name].ts        # Component implementation
│   │       ├── Zen[Name].test.ts   # Jest tests (co-located)
│   │       └── Zen[Name].stories.js
│   ├── styles/
│   │   ├── main.scss               # Root import
│   │   ├── tokens/                 # Design tokens (3-tier)
│   │   │   ├── _primitives.scss    # Raw values (colours, sizes)
│   │   │   ├── _semantic.scss      # Purpose-driven aliases
│   │   │   └── _typography.scss
│   │   ├── themes/
│   │   │   └── _light.scss         # CSS custom properties (--rw-*)
│   │   ├── components/             # One SCSS file per component
│   │   │   └── _index.scss         # Imports all component SCSS
│   │   ├── utilities/              # SMACSS utility classes
│   │   └── mixins/
│   ├── utils/
│   │   └── escapeHtml.ts           # XSS-safe HTML escaping
│   └── types/
│       └── index.d.ts              # HTMLElementTagNameMap declarations
├── docs/                           # Static HTML documentation site
│   ├── index.html                  # Sidebar nav + iframe shell
│   └── [name]-components.html      # One page per component
├── dist/                           # Build output (git-ignored)
└── rollup.config.js
```

## Bundle Outputs

Three bundles are produced from a single build (`npm run build`):

| Output | Format | Entry | Consumer |
|---|---|---|---|
| `dist/index.js` | CJS | `src/index.ts` | Node / CommonJS bundlers |
| `dist/index.esm.js` | ESM | `src/index.ts` | Webpack, Vite, modern bundlers |
| `dist/zen-style.js` | IIFE (`window.ZenStyle`) | `src/index.webcomponents.ts` | `<script src="">`, ASPX, vanilla JS |
| `dist/index.webcomponents.js` | ESM | `src/index.webcomponents.ts` | `<script type="module">`, docs |
| `dist/styles/zen-style.css` | CSS | SCSS compiler | All usage patterns — always required |

## Component Architecture

### Base Class

All components extend `ZenElement` (`src/components/base/ZenElement.ts`), which itself extends `HTMLElement`. `ZenElement` provides:
- Lifecycle helpers (`connectedCallback`, `disconnectedCallback`)
- Managed event listener cleanup
- Attribute observation utilities

### Light DOM rendering

Components render to **Light DOM** using `innerHTML`. There is no Shadow DOM. This means:
- Component styles come from `zen-style.css` (must be loaded on the page)
- Consumers can style component internals with standard CSS
- No `::part()` or `::slotted()` needed

### Custom Element Registration

Every component self-registers on import with a guard:
```ts
if (!customElements.get('rw-[name]')) {
  customElements.define('rw-[name]', Zen[Name]);
}
```

Importing from either entry point triggers registration automatically.

## Service Architecture

Services are singleton instances that create and manage component elements programmatically. They are useful when you cannot embed a component statically in the DOM.

```
ZenDialogService      → creates <rw-dialog> elements, appends to document.body
ZenNotificationService → creates <rw-notification> elements, appends to a container
ZenToastService       → creates <rw-toast> elements, stacks them in a container
ZenTabService         → manages <rw-tab>/<rw-tabs> programmatically
```

Each service file exports:
- A **class** (`ZenDialogServiceClass`) — for consumers who need multiple instances
- A **singleton** (`ZenDialogService`) — the default, used by most consumers

## Design Token Hierarchy

Tokens follow a 3-tier system defined in `src/styles/tokens/`:

```
Tier 1 — Primitives     Raw values: #1C7FCC, 16px, 400
         ↓
Tier 2 — Semantic       Purpose aliases: --rw-color-primary, --rw-font-size-body
         ↓
Tier 3 — Component      Scoped overrides: --rw-button-bg, --rw-dialog-max-width
```

All tiers are emitted as CSS custom properties in `src/styles/themes/_light.scss`.

## Docs Site

The docs site in `docs/` is static HTML — no build step required. Each component has one page (`[name]-components.html`) linked from `docs/index.html` via an iframe sidebar.

To view: `npm run serve` → `http://localhost:8081/docs/index.html`

The docs load `dist/index.webcomponents.js` as an ES module, so a build must exist before the docs will render correctly.
