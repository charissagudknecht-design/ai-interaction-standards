# Contributing to zen-style

Thanks for your interest in contributing. This guide covers setup, workflows, and how to add or change components.

## Prerequisites

- **Node.js** v14 or higher (v18+ recommended)
- **npm** v6 or higher

## Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd zen-style
   npm install
   ```

2. **Verify the build**

   ```bash
   npm run build
   ```

   This compiles TypeScript and SCSS into `dist/`.

3. **Run tests**

   ```bash
   npm test
   ```

4. **Lint and format**

   ```bash
   npm run lint
   npm run format:check
   ```

   Fix issues with `npm run lint:fix` and `npm run format` if needed.

## Development workflow

- **Build the library:** `npm run build`
- **Watch styles only:** `npm run watch:styles` (SCSS → `dist/styles/zen-style.css`)
- **Run tests (watch):** `npm run test:watch`
- **Run Storybook:** `npm run storybook` (opens on port 6006)
- **Serve the repo (e.g. for docs):** `npm run serve` (port 8081; open `http://localhost:8081/docs/index.html` for the docs site)

## Key commands

| Command | Description |
|--------|-------------|
| `npm run build` | Full build (Rollup + Sass) |
| `npm run build:styles` | Compile SCSS only |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | Lint source |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run storybook` | Start Storybook |
| `npm run build:docs` | Build docs site into `build/` |
| `npm run serve` | Static server (port 8081) |

## Adding a new component

1. **Create a component folder** under `src/components/`, e.g. `src/components/MyWidget/`.

2. **Implement the component** in TypeScript (e.g. `ZenMyWidget.ts`):
   - Extend `ZenElement` (from `src/components/base/ZenElement.ts`), not `HTMLElement` directly.
   - Use `observedAttributes`, `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`.
   - Register with `customElements.define('rw-my-widget', ZenMyWidget)` (guard with `!customElements.get('rw-my-widget')`).

3. **Add styles** in `src/styles/components/_my-widget.scss` and include them via `src/styles/components/_index.scss` (or the main component entry).

4. **Export from the library:**
   - In `src/index.ts`: import the component and re-export the class (and any public types).
   - In `src/index.webcomponents.ts`: same, if it’s a web component.

5. **Declare types** in `src/types/index.d.ts` (e.g. class and `HTMLElementTagNameMap['rw-my-widget']`).

6. **Add a test file** `MyWidget.test.ts` next to the component (Jest). Run with `npm test`.

7. **Add a Storybook story** `MyWidget.stories.js` in the same folder (or under `src/stories/` for CSS-only demos). Run with `npm run storybook`.

8. **Document** the component in the JSDoc (`@example`, `@attr`, `@fires`) and, if needed, add or update a page in `docs/` and link it from the docs index.

## Naming conventions

All names in the library follow one rule derived from the component name:

| Layer | Pattern | Example |
|---|---|---|
| Custom element tag | `rw-[component-name]` | `rw-nested-menu` |
| TypeScript class | `Zen[ComponentName]` | `ZenNestedMenu` |
| CSS class prefix | `rw-[component-name]` | `rw-nested-menu-item` |
| Custom event prefix | `rw-[event-name]` | `rw-menu-apply` |

Given a tag name, every other name is fully predictable:
- Strip `rw-`, PascalCase, prepend `Zen` → TypeScript class
- Prefix event names with `rw-` → Custom events

## Code style

- **TypeScript:** Strict mode; no `any` or `@ts-ignore` in library code.
- **Formatting:** Prettier (run `npm run format` before committing).
- **Linting:** ESLint; fix with `npm run lint:fix`.
- **Naming:** Follow the naming conventions table above.

### XSS Prevention

All user-provided data rendered via `innerHTML` **must** be sanitized with the shared `escapeHtml()` utility:

```typescript
import { escapeHtml } from '../../utils/escapeHtml';

// Always escape dynamic values in templates
this.innerHTML = `<span>${escapeHtml(userInput)}</span>`;
```

### Structured Logging

Use the structured logger instead of raw `console.*` calls in component source code:

```typescript
import { createLogger } from '../../utils/logger';
const log = createLogger('MyComponent');

log.warn('Invalid options format');   // [zen-style:MyComponent] Invalid options format
log.error('Registration failed', e);  // [zen-style:MyComponent] Registration failed <error>
```

`console.*` is acceptable in Storybook stories and build scripts but not in `src/components/`.

## Submitting changes

1. Make your changes on a branch.
2. Run `npm run build`, `npm test`, `npm run lint`, and `npm run format:check`.
3. Update `CHANGELOG.md` under the `[Unreleased]` section.
4. Update `CLAUDE.md` if adding components, services, or architectural changes.
5. Open a pull request with a clear description of the change and, if relevant, how to verify it (e.g. “Run Storybook and check Component → New story”).

### Pull request checklist

- [ ] All CI checks pass (lint, format, test, build)
- [ ] Tests added or updated for changed behavior
- [ ] `CHANGELOG.md` updated
- [ ] `CLAUDE.md` updated (if component/service/architecture changed)
- [ ] No raw `console.*` in `src/components/` — use `createLogger()`
- [ ] All `innerHTML` with dynamic data uses `escapeHtml()`

## Documentation and Storybook

- **HTML docs** in `docs/` are static pages. To rebuild the docs site (e.g. after adding new pages or changing scripts), run `npm run build:docs`. Output goes to `build/`.
- **Storybook** is the main place to develop and showcase components. Stories live next to components (`*.stories.js`) or in `src/stories/`. Use the Web Components framework; no React.

## Release process

Releases are triggered by pushing a version tag:

```bash
npm version patch    # or minor / major
git push --tags
```

The `publish.yml` GitHub Actions workflow will lint, test, build, and publish to npm automatically. See `CHANGELOG.md` for version history.

## Questions or issues

If something is unclear or you run into problems, open an issue in the repository with details (Node/npm versions, command you ran, and error output).
