# Agent context – zen-style

This file gives AI assistants (Cursor, Copilot, Claude, etc.) enough context to work effectively in this repo.

## What this repo is

- **zen-style** is a **Web Components + SCSS** design system. It is **not** a React library; there are no React dependencies.
- Consumers get custom elements (e.g. `<rw-button>`, `<rw-switch>`, `<rw-dropdown-menu>`) and compiled CSS. They use the library in any framework or vanilla JS.

## Tech stack

- **Language:** TypeScript (strict mode). Source is in `src/**/*.ts`. Some Storybook stories and config are `.js`.
- **Components:** Custom elements (Web Components) implemented as classes extending `HTMLElement`, registered with `customElements.define`.
- **Styles:** SCSS in `src/styles/`. Built to `dist/styles/zen-style.css`. Design tokens live under `src/styles/tokens/`.
- **Build:** Rollup (library bundles) and Sass (CSS). No React, no JSX in the library.

## Entry points

- **Main library (npm consumers):** `src/index.ts` → builds to `dist/index.js` (CJS) and `dist/index.esm.js` (ESM). Imports all components and styles.
- **Web-components-only (docs / browser):** `src/index.webcomponents.ts` → builds to `dist/index.webcomponents.js`. Same components, no React-related code.
- **Public types:** `src/types/index.d.ts` (and generated under `dist/types/` when building).

## Directory layout

```
src/
├── index.ts              # Main entry (components + styles)
├── index.webcomponents.ts
├── types/                # Shared TypeScript types and declarations
├── components/           # One folder per component
│   ├── base/             # ZenElement base class
│   ├── Button/           # rw-button (ZenButton.ts, stories, test)
│   ├── Dialog/
│   ├── DropdownMenu/     # Includes trigger="kebab" for overflow menu
│   ├── Switch/
│   └── ...
├── styles/               # SCSS: tokens, components, themes, utilities
│   ├── main.scss         # Main stylesheet entry
│   ├── tokens/
│   ├── components/
│   └── ...
└── stories/              # Storybook stories (MDX + JS)
```

Each component folder typically has: `ComponentName.ts` (or `Zen*.ts`), `*.test.ts`, `*.stories.js`, and sometimes `.scss`.

## Commands (run from repo root)

| Command | Purpose |
|--------|---------|
| `npm install` | Install dependencies |
| `npm run build` | Build library (Rollup + Sass) → `dist/` |
| `npm run build:styles` | Compile SCSS only → `dist/styles/zen-style.css` |
| `npm test` | Run unit tests (Jest) |
| `npm run lint` | Lint `src` (ESLint) |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format:check` | Check formatting (Prettier) |
| `npm run format` | Format code (Prettier) |
| `npm run storybook` | Start Storybook (default port 6006) |
| `npm run build:docs` | Build docs site → `build/` (runs styles + full build, then copies docs) |
| `npm run serve` | Serve repo root (e.g. docs at `/docs/index.html`) on port 8081 |

## Conventions

- **Typing:** Use TypeScript strict mode. Avoid `any` and `@ts-ignore`. Types for public API live in `src/types/`.
- **Components:** Extend `HTMLElement`, use `static get observedAttributes()`, implement `connectedCallback` / `disconnectedCallback` / `attributeChangedCallback`. Register with `customElements.define('rw-*', Class)` once.
- **Naming:** Custom elements are `rw-*` (e.g. `rw-button`, `rw-switch`). Tag names are kebab-case.
- **Tests:** Co-located `*.test.ts` or `*.test.js`. Run with `npm test`. Use Jest and (where relevant) `@testing-library/jest-dom`.
- **Docs:** Component JSDoc should include `@example`, `@attr`, `@fires`, and `@requires` where useful. HTML docs live in `docs/` and are built/copied by `build:docs`.

## Where to change things

- **Add/fix a component:** `src/components/<Name>/` and, if needed, `src/styles/components/_<name>.scss`. Export from `src/index.ts` (and `index.webcomponents.ts` if it’s a web component).
- **Add/fix types:** `src/types/index.d.ts` or component-specific types in the component folder.
- **Add/fix styles/tokens:** `src/styles/` (tokens, components, themes).
- **Add/fix docs:** `docs/*.html` and/or Storybook stories under `src/components/**/*.stories.js` or `src/stories/`.

## Useful references

- **Agent readiness:** See `AGENT_READINESS_ASSESSMENT.md` for scoring and improvement ideas.
- **Contributing:** See `CONTRIBUTING.md` for setup, workflow, and how to add a component or run docs.
