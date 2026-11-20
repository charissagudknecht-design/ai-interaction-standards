# Versioning Guide for Zen Style Design System

## Current Version
**v1.0.0** (in package.json)

## Versioning Strategy

### Semantic Versioning (SemVer)
This project follows [Semantic Versioning](https://semver.org/):

**Format:** `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x) - Breaking changes
- **MINOR** (x.1.x) - New features (backwards compatible)
- **PATCH** (x.x.1) - Bug fixes (backwards compatible)

### Examples

```
1.0.0 → 1.0.1  (Bug fix)
1.0.1 → 1.1.0  (New feature)
1.1.0 → 2.0.0  (Breaking change)
```

---

## How to Version

### Method 1: Using npm version (Recommended)

```bash
# Patch release (bug fixes)
npm version patch
# 1.0.0 → 1.0.1

# Minor release (new features)
npm version minor
# 1.0.0 → 1.1.0

# Major release (breaking changes)
npm version major
# 1.0.0 → 2.0.0
```

**What `npm version` does:**
1. Updates version in `package.json`
2. Creates a git commit
3. Creates a git tag (e.g., `v1.0.1`)

### Method 2: Manual Versioning

```bash
# 1. Update package.json manually
# Change: "version": "1.0.0" → "version": "1.0.1"

# 2. Update CHANGELOG.md

# 3. Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"

# 4. Create git tag
git tag v1.0.1

# 5. Push with tags
git push && git push --tags
```

---

## Release Workflow

### Step-by-Step Release Process

#### 1. **Prepare the Release**

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Ensure all tests pass
npm test

# Ensure build works
npm run build

# Check for linting issues
npm run lint
```

#### 2. **Update CHANGELOG.md**

Update the changelog with the new version:

```markdown
## [1.0.1] - 2026-02-12

### Fixed
- Fixed dropdown positioning issue
- Updated AI documentation

### Changed
- Improved build process to include AI docs automatically
```

#### 3. **Bump Version**

```bash
# For bug fixes
npm version patch -m "chore: release v%s"

# For new features
npm version minor -m "feat: release v%s"

# For breaking changes
npm version major -m "feat!: release v%s"
```

#### 4. **Build the Package**

```bash
npm run build
```

#### 5. **Push to Git**

```bash
git push && git push --tags
```

#### 6. **Publish to npm**

```bash
# First time: login to npm
npm login

# Publish (dry run first)
npm publish --dry-run

# Actual publish
npm publish
```

#### 7. **Create GitHub Release** (Optional)

Go to GitHub → Releases → Create new release:
- Tag: Select the version tag (e.g., `v1.0.1`)
- Title: `v1.0.1`
- Description: Copy from CHANGELOG.md

---

## Breaking Changes

### What Counts as a Breaking Change?

**✅ BREAKING (Major version bump):**
- Removing a component
- Removing component attributes/properties
- Changing component API
- Renaming CSS classes
- Removing utility classes
- Changing design token names
- Removing exports from package

**Examples:**
```javascript
// BREAKING: Removed trigger attribute
// Before: <rw-dropdown-menu trigger="kebab">
// After:  <rw-dropdown-menu> (requires custom button)
// Version: 1.0.0 → 2.0.0

// BREAKING: Renamed CSS class
// Before: .rw-button-primary
// After:  .rw-btn-primary
// Version: 1.0.0 → 2.0.0
```

---

## Non-Breaking Changes

### New Features (Minor version bump)

**✅ NEW FEATURES (Minor version bump):**
- Adding new components
- Adding new attributes (optional)
- Adding new utility classes
- Adding new design tokens
- Adding new events

**Examples:**
```javascript
// NEW: Added new component
// Added: <rw-card> component
// Version: 1.0.0 → 1.1.0

// NEW: Added optional attribute
// <rw-button loading>  // New optional attribute
// Version: 1.0.0 → 1.1.0
```

### Bug Fixes (Patch version bump)

**✅ BUG FIXES (Patch version bump):**
- Fixing bugs
- Fixing styles
- Improving documentation
- Performance improvements (without API changes)

**Examples:**
```javascript
// FIX: Fixed positioning bug
// Version: 1.0.0 → 1.0.1

// FIX: Updated documentation
// Version: 1.0.1 → 1.0.2
```

---

## CHANGELOG Format

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [Unreleased]
### Added
- New features go here

### Changed
- Changes to existing features

### Fixed
- Bug fixes

### Removed
- Removed features (breaking!)

## [1.1.0] - 2026-02-15

### Added
- New `<rw-card>` component
- Added `loading` attribute to `<rw-button>`

### Fixed
- Fixed dropdown positioning on mobile

## [1.0.1] - 2026-02-12

### Fixed
- Fixed kebab menu styling issue

### Changed
- Updated AI documentation

## [1.0.0] - 2026-02-01

### Added
- Initial release
- Core components: Button, Input, Dialog, etc.
```

---

## Publishing Checklist

Before publishing a new version:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Changes pushed to repository
- [ ] npm publish completed
- [ ] GitHub release created (optional)
- [ ] Documentation updated (if needed)

---

## Version Scripts

Add these to your `package.json` for easier versioning:

```json
{
  "scripts": {
    "version": "npm run build && git add dist/",
    "postversion": "git push && git push --tags",
    "prepublishOnly": "npm test && npm run build",
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  }
}
```

Then use:
```bash
npm run release:patch   # Bug fix release
npm run release:minor   # Feature release
npm run release:major   # Breaking change release
```

---

## Pre-release Versions

For beta, alpha, or rc versions:

```bash
# Create alpha version
npm version prerelease --preid=alpha
# 1.0.0 → 1.0.1-alpha.0

# Create beta version
npm version prerelease --preid=beta
# 1.0.0 → 1.0.1-beta.0

# Create release candidate
npm version prerelease --preid=rc
# 1.0.0 → 1.0.1-rc.0

# Publish pre-release
npm publish --tag beta
```

Users can install pre-release versions:
```bash
npm install zen-style@beta
npm install zen-style@1.0.1-beta.0
```

---

## Deprecation Strategy

When deprecating features:

1. **Mark as deprecated** (Minor version)
   ```javascript
   /**
    * @deprecated Use newMethod() instead. Will be removed in v2.0.0
    */
   ```

2. **Add console warning**
   ```javascript
   console.warn('trigger="kebab" is deprecated and will be removed in v2.0.0');
   ```

3. **Update docs** - Add deprecation notice

4. **Remove in next major version** (Major version)

**Timeline:**
```
v1.5.0 - Deprecate feature (with warnings)
v1.6.0 - Still deprecated
v1.7.0 - Still deprecated
v2.0.0 - Remove feature (BREAKING)
```

---

## Migration Guides

For breaking changes, create migration guides:

**File:** `MIGRATION_v2.md`

```markdown
# Migrating from v1.x to v2.0

## Breaking Changes

### Dropdown Menu - Removed kebab trigger

**Before (v1.x):**
\`\`\`html
<rw-dropdown-menu trigger="kebab"></rw-dropdown-menu>
\`\`\`

**After (v2.x):**
\`\`\`html
<button id="btn">⋮</button>
<rw-dropdown-menu id="menu"></rw-dropdown-menu>
<script>
  btn.addEventListener('click', () => menu.toggle(btn));
</script>
\`\`\`
```

---

## Checking Current Version

Users can check the version:

```javascript
// In package.json
import pkg from 'zen-style/package.json';
console.log(pkg.version);

// Via npm
npm list zen-style

// Check installed version
npm view zen-style version

// Check all available versions
npm view zen-style versions
```

---

## Version Badges

Add to README.md:

```markdown
![npm version](https://img.shields.io/npm/v/zen-style)
![npm downloads](https://img.shields.io/npm/dm/zen-style)
```

---

## Quick Reference

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fix | Patch | 1.0.0 → 1.0.1 |
| New feature (backwards compatible) | Minor | 1.0.0 → 1.1.0 |
| Breaking change | Major | 1.0.0 → 2.0.0 |
| Deprecation | Minor | 1.0.0 → 1.1.0 |
| Documentation | Patch | 1.0.0 → 1.0.1 |
| Performance (no API change) | Patch | 1.0.0 → 1.0.1 |

---

## Summary

**Current:** v1.0.0 (in package.json)  
**Strategy:** Semantic Versioning (SemVer)  
**Process:** Update CHANGELOG → Bump version → Build → Push → Publish  
**Breaking Changes:** Require major version bump  
**New Features:** Require minor version bump  
**Bug Fixes:** Require patch version bump
