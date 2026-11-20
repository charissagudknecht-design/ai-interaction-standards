# Agent Readiness Assessment

**Repository:** zen-style  
**Evaluated:** 2025-02-07  
**Overall Score:** 70/100

---

## Score Breakdown

| Dimension            | Score  | Rating   |
|----------------------|--------|----------|
| Context Files        | 6/20   | Fair     |
| Type Coverage        | 20/20  | Excellent|
| Function Size        | 10/15  | Good     |
| Documentation        | 10/15  | Good     |
| Dependencies         | 7/10   | Good     |
| Test Discovery       | 9/10   | Very Good|
| Module Boundaries    | 8/10   | Very Good|

---

## Check 1: Context Files — 6/20

**Files found:**
- `README.md` — present, describes purpose, installation, scripts, deployment
- `.cursor/rules/codacy.mdc` — Codacy MCP / analysis behavior
- `.cursor/rules/figma-integration.mdc` — Figma–code token mapping and integration

**Not found:** CLAUDE.md, AGENTS.md, CONTEXT.md, ARCHITECTURE.md, CONTRIBUTING.md, DEVELOPMENT.md, CODEOWNERS, .cursorrules

**Quality:** Fair. README gives basic context and commands; .cursor rules help for Codacy and Figma but do not explain repo architecture, conventions, or agent-specific guidance for the codebase.

**Gaps:**
- No single “agent context” file (CLAUDE.md or AGENTS.md) describing stack, structure, and how to work in the repo
- No CONTRIBUTING or architecture doc
- README project structure still references “React components” and “index.js” (outdated)

**Recommendations:**
- Add `AGENTS.md` or `CLAUDE.md`: tech stack (Web Components, TypeScript, SCSS), `src/components/` layout, build/test/lint commands, and conventions (naming, exports, tests)
- Add `CONTRIBUTING.md` with setup, branch/PR expectations, and code style
- Fix README project structure to match current layout (Web Components, TypeScript, no React)

---

## Check 2: Type Coverage — 20/20

**Primary language:** TypeScript (+ JS for stories/config)  
**Type system:** TypeScript with `strict: true` in tsconfig.json (includes strictNullChecks)

**Findings:**
- **`any` usage:** 0 in `src/**/*.ts`
- **@ts-ignore / @ts-nocheck:** 0
- **Source files:** 29 `.ts` files (components, types, index), 15 `.js` (stories, one test); core library is fully TypeScript

**Coverage estimate:** >90% (all library code in TypeScript, strict mode, no escape hatches)

**Deductions:** None (strict enabled, no any, no @ts-ignore)

**Score: 20/20**

---

## Check 3: Function Size & Complexity — 10/15

**Observation:** Components are implemented as single classes with many methods. File sizes vary from moderate to large.

**Representative file sizes (LOC):**
- `Dialog.ts` — ~646
- `Switch.ts` — ~440
- `DropdownMenu/DropdownMenu.ts` — ~454
- `Notification/Notification.ts` — ~397
- Smaller components (e.g. ZenButton, ZenCheckbox) — ~100–250

**Assessment:** Method-level size is mostly in the 10–40 LOC range, but several components are 400+ lines in one file. Overall average is in the “30–50 LOC” band with some large modules.

**Problem areas:**
- `Dialog.ts` — single large class; could be split (e.g. focus trap, stacking, template helpers)
- `Switch.ts` — long single file; rendering and behavior could be separated
- `DropdownMenu.ts` — positioning and lifecycle in one class

**Score: 10/15** (average function 30–50 LOC)

**Recommendations:**
- Extract focus-trap and stacking logic from Dialog into small helpers or modules
- Break long methods in Dialog/Switch into smaller, named functions
- Keep new components under ~250 LOC per file where possible

---

## Check 4: Documentation Quality — 10/15

**README:** Explains purpose, installation, quick start, available components, documentation location, dev setup, scripts, project structure, deployment. Good but not exhaustive.

**Inline docs:** Many components have JSDoc blocks with:
- `@example` (usage)
- `@attr` (attributes)
- `@fires` (events)
- `@requires` (CSS)

Examples: Dialog, Switch, DropdownMenu, ZenElement, Notification, Toast, Tab, etc.

**API/docs:** `docs/` contains HTML documentation and a checklist; no generated API reference (e.g. TypeDoc). Public types are in `src/types/index.d.ts`.

**Gaps:**
- No single place documenting all public APIs and events
- Complex logic (e.g. Dialog stacking, focus trap) has limited inline comments
- README project structure is outdated

**Score: 10/15** (good README + solid JSDoc; no full API docs or comments on all complex code)

**Recommendations:**
- Add TypeDoc (or similar) and document exported components and types
- Add short comments for non-obvious logic (focus trap, positioning, stacking)
- Update README structure and remove “React” references

---

## Check 5: Dependency Clarity — 7/10

**Import style:** Consistently relative (`from '../DropdownMenu/DropdownMenu'`, `from './ZenButton'`). No path aliases used in source (aliases exist in tsconfig for tooling).

**Structure:**
- Clear entry points: `src/index.ts`, `src/index.webcomponents.ts`
- No circular dependencies observed
- Components import from sibling or parent (e.g. Kebab previously used DropdownMenu); layers are simple

**Abstraction:** Services (DialogService, NotificationService) encapsulate behavior; components register as custom elements. No formal DI; dependencies are direct imports.

**Score: 7/10** (clean relative imports, clear boundaries, no circular deps; no interface-driven or DI-based design)

---

## Check 6: Test Discoverability — 9/10

**Test layout:** Co-located next to source:
- `ComponentName.test.ts` or `ComponentName.test.js` next to `ComponentName.ts` / `ComponentName.js`

**Test files found (11):**
- Button, Checkbox, Dialog, DropdownMenu, Input, Notification, SelectionMenu, SplitButton, Switch, Tab, Toast

**Naming:** Consistent `*.test.ts` / `*.test.js`. Jest is configured with `testMatch` for `*.test.{ts,js}` and `*.spec.{ts,js}`.

**Runnable:** Single command: `npm test`. Coverage and a11y scripts exist.

**Gaps:** No dedicated fixtures directory; no explicit separation of unit vs integration tests in structure.

**Score: 9/10** (consistent naming, co-located, clear mapping, single command; minor deduction for no fixture/type separation)

---

## Check 7: Module Boundaries — 8/10

**Layout:**
- `src/components/<ComponentName>/` — one folder per component (Button, Dialog, DropdownMenu, etc.)
- `src/components/base/` — ZenElement and base index
- `src/styles/` — SCSS and tokens
- `src/types/` — shared types and `index.d.ts`

**Exports:** Public API is centralized in `src/index.ts` and `src/index.webcomponents.ts` with explicit re-exports. Types re-exported from `src/types/index.d.ts`.

**Boundaries:** Each component folder contains implementation, tests, and often stories. Cross-component use is explicit (e.g. DropdownMenu used by docs). No deep cross-import webs.

**Score: 8/10** (clear modules and exports; some components are large single files, so “excellent” boundaries with minimal coupling not fully met)

---

## Critical Gaps

1. **No agent-facing context** — No CLAUDE.md/AGENTS.md describing stack, structure, and conventions for AI-assisted editing.
2. **README inaccuracies** — Project structure still mentions React and index.js; should reflect Web Components + TypeScript.
3. **Very large component files** — Dialog, Switch, DropdownMenu (400–650 LOC) make targeted edits and reasoning harder for agents.

---

## Quick Wins (High Impact, Low Effort)

1. **Add AGENTS.md** — One-pager: “This repo is a Web Components + SCSS library. Entry points: src/index.ts and src/index.webcomponents.ts. Components live in src/components/<Name>/. Run build/test/lint with npm run build, npm test, npm run lint. Use TypeScript strict; no React.”
2. **Update README** — Fix project structure (remove React, index.js; add Web Components, TypeScript, `src/index.ts`).
3. **Add CONTRIBUTING.md** — Clone, install, build, test, and how to add a component or run docs.

---

## Medium-Term Improvements

1. **Document architecture** — Short ARCHITECTURE.md or section in AGENTS.md: entry points, component vs service vs styles, how docs are built and served.
2. **Reduce component file size** — Extract helpers from Dialog (focus trap, stacking) and optionally from Switch/DropdownMenu into small modules.
3. **API documentation** — Add TypeDoc (or similar) and document exported components, types, and events in one place.

---

## AI Acceleration Potential by Module

| Area               | Type | Size/Complexity | Docs   | Tests | Boundaries | Potential |
|--------------------|------|------------------|--------|-------|------------|-----------|
| src/components/*   | High | Mixed (some large) | Good | Yes   | Clear      | Medium    |
| src/index*.ts      | High | Small            | Fair   | N/A   | Clear      | High      |
| src/styles         | N/A  | —                | Tokens | N/A   | Clear      | High      |
| src/types          | High | Small            | Good   | N/A   | Clear      | High      |

**Summary:** TypeScript and structure give **high** potential where files are smaller (index, types, styles, smaller components). **Medium** where single-file components are 400+ LOC (Dialog, Switch, DropdownMenu).

---

## Recommended Preparation Roadmap

- **Week 1:** Add AGENTS.md (or CLAUDE.md), fix README structure, add CONTRIBUTING.md.
- **Week 2–3:** Add short architecture section; optionally start TypeDoc and document public API.
- **Month 2:** Refactor largest components (Dialog, then Switch/DropdownMenu) into smaller modules and document complex behavior.

---

*Assessment based on the Agent Readiness Evaluation criteria (Context Files, Type Coverage, Function Size & Complexity, Documentation, Dependency Clarity, Test Discoverability, Module Boundaries).*
