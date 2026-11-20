# Changelog

All notable changes to the Zen Style Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Structured Logger** (`src/utils/logger.ts`) - Levelled, component-scoped logging
  - `createLogger(component)` returns `debug`, `info`, `warn`, `error` methods
  - All output prefixed with `[zen-style:<Component>]` for easy DevTools filtering
  - Configurable global level via `setLogLevel()` (default: `warn`)
  - Replaces all raw `console.warn()` calls across 6 components
- **npm Publish Workflow** (`.github/workflows/publish.yml`)
  - Automated npm publish on `v*` tags
  - Runs lint, test, and build before publishing
- **CONTRIBUTING.md** - Contributor guidelines with PR process, coding standards, and component checklist

### Security
- **XSS hardening** - Added `escapeHtml()` sanitization to ZenSplitButton
  - `renderMenuItems()` now escapes `item.label`, `item.value`, and `item.icon`
  - Main render escapes `this.label`
- **XSS hardening** - ZenTabs `updateTab()` now escapes string content via `escapeHtml()`

### Added
- **Typography CSS Variables** - All design tokens exposed as CSS custom properties
  - Font size variables: `--font-size-{category}-{size}` (page-title, headline, body, action, footnote)
  - Line height variables: `--line-height-{category}-{size}`
  - Font weight variables: `--font-weight-{weight}` (regular, medium, semibold, bold)
  - Letter spacing variables: `--letter-spacing-{spacing}` (tight, normal, wide, wider)
  - Enables granular typography control in custom components
  - Full documentation in `CSS_VARIABLES_TYPOGRAPHY_GUIDE.md`
  - Interactive demo page: `css-variables-demo.html`
- **Typography Utility Classes** - Complete set of typography classes following SMACSS methodology
  - Page Title classes: `.rw-page-title-large` (24px), `.rw-page-title-small` (20px)
  - Headline classes: `.rw-headline-large` (18px), `.rw-headline-medium` (16px), `.rw-headline-small` (14px)
  - Body text classes: `.rw-body-large` (16px), `.rw-body-medium` (14px), `.rw-body-small` (14px)
  - Action text classes: `.rw-action-large` (16px), `.rw-action-medium` (14px), `.rw-action-small` (12px)
  - Footnote classes: `.rw-footnote-large` (12px), `.rw-footnote-medium` (11px), `.rw-footnote-small` (10px)
  - All classes use design tokens for consistency
  - Updated documentation at `docs/typography-components.html`
  - Created `typography-demo.html` for visual reference
- **NEW COMPONENT**: Nested Menu (`<rw-nested-menu>`)
  - Hierarchical menu component with flyout submenus
  - Multi-level nesting support (unlimited depth)
  - Smart positioning with auto-detection
  - Full keyboard navigation (arrow keys, enter, escape)
  - Programmatic trigger control via `open()`, `close()`, `toggle()` methods
  - Left-aligned menu positioning
  - Hover and click interactions
  - Disabled items and visual separators
  - Complete TypeScript types and test coverage
  - Documentation page at `docs/nested-menu-components.html`
- AI-friendly documentation optimized for AI agents (Cursor, ChatGPT, Copilot)
  - `.cursorrules` - Primary AI reference with architecture guidelines
  - `AI_AGENT_GUIDE.md` - Quick reference guide
  - `AI_INDEX.md` - Navigation hub for all AI docs
  - `AI_INTEGRATION_GUIDE.md` - Integration strategies for different AI tools
  - `COMPONENT_API_REFERENCE.md` - Complete component API documentation
  - `COMPONENT_SELECTION_GUIDE.md` - Decision guide for choosing components
  - `LEGACY_PROJECT_SETUP.md` - Setup guide for vanilla JavaScript projects
- Automated build process to copy AI docs to `dist/docs/`
- `VERSIONING.md` - Comprehensive versioning and release guide
- Enhanced utility classes following SMACSS methodology
  - Mixin-based flexbox utility generation
  - Comprehensive gap utilities (`rw-gap-*`, `rw-gap-row-*`, `rw-gap-col-*`)
  - Complete alignment utilities
- `dist/README.md` - Distribution guide for package users

### Changed
- **BREAKING**: Removed `trigger="kebab"` from DropdownMenu component
  - All dropdowns now require a custom trigger button
  - Migration: Replace `<rw-dropdown-menu trigger="kebab">` with custom button + `toggle(button)`
- **CSS Variable Naming Consistency** - Standardized all typography CSS variables to kebab-case
  - Changed legacy variables like `--Typography-Size-Headlines---Small` to `--font-size-headline-small`
  - All variables now follow `--{property}-{category}-{size}` pattern
  - Updated in `_typography.scss`, `_components.scss`, and `_banner.scss`
  - Maintains fallback values for backwards compatibility
- Build process now includes AI documentation in `dist/docs/` automatically
- Updated package.json to ship only `dist/` folder (includes all docs)
- Simplified vanilla JavaScript integration - just copy `dist/` folder
- Updated README with clearer installation instructions
- Enhanced flexbox utilities with SMACSS naming conventions
- Improved grid system with design token-based spacing

### Removed
- **BREAKING**: Removed kebab menu component (`_kebab.scss`)
- **BREAKING**: Removed `trigger` attribute from DropdownMenu
- **BREAKING**: Removed `DropdownTrigger` type export
- Removed legacy/deprecated utility classes from grid and flexbox
- Removed setup scripts (now handled by build process)

### Fixed
- Inconsistent naming conventions in utility classes
- Grid and flexbox utilities now consistently use `rw-` prefix
- Dropdown menu positioning with left/right alignment
- Documentation caching issues in local development

## [1.0.0] - 2026-02-12

### Added
- Initial release of Zen Style Design System
- Core components: Button, Switch, Input, Checkbox, Radio, Dropdown, Dropdown Menu
- Navigation components: Tabs
- Feedback components: Banner, Toast, Notification
- Overlay components: Dialog, Editor, Tooltip
- Layout utilities: Grid, Flexbox
- Animation utilities
- Loading/Shimmer components
- Badge component
- Toggle component
- Documentation site with live examples
- TypeScript definitions for all components
- Base `ZenElement` class for standardized Web Components
- Testing infrastructure with Jest and accessibility testing
- Dark/light theme support via CSS custom properties
- Token-based design system architecture
- Comprehensive HTML documentation with live demos

### Component Status

| Component | Status |
|-----------|--------|
| Button | Stable |
| Switch | Stable |
| Input | Stable |
| Checkbox | Stable |
| Radio | Stable |
| Dropdown | Stable |
| Dropdown Menu | Stable |
| Tabs | Stable |
| Banner | Stable |
| Toast | Stable |
| Notification | Beta |
| Dialog | Stable |
| Editor | Beta |
| Tooltip | Stable |
| Badge | Stable |
| Toggle | Stable |
| Grid | Stable |
| Flexbox | Stable |

---

## Version Guidelines

- **Stable**: Production-ready, API is stable
- **Beta**: Feature complete, API may have minor changes
- **Alpha**: In development, API will change
- **Deprecated**: Will be removed in a future version

## Migration Notes

### From Pre-release to v1.0.0

If you were using kebab menu functionality, see the breaking changes above for migration instructions.
