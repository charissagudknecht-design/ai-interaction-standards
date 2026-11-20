/**
 * Build script to copy AI documentation files to dist folder
 * Run after Rollup build completes
 */

const fs = require('fs');
const path = require('path');

// Files to copy to dist
const AI_FILES = [
  'README.md',
  'AGENTS.md',
  '.cursorrules'
];

// Source and destination directories
const SOURCE_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const DOCS_DIR = path.join(DIST_DIR, 'docs');

console.log('📋 Copying AI documentation to dist/docs/...');

// Create dist/docs directory if it doesn't exist
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Copy each file
let copiedCount = 0;
let errorCount = 0;

AI_FILES.forEach(file => {
  const sourcePath = path.join(SOURCE_DIR, file);
  const destPath = path.join(DOCS_DIR, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`  ✓ Copied ${file}`);
      copiedCount++;
    } else {
      console.warn(`  ⚠ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`  ✗ Error copying ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Done! Copied ${copiedCount} files to dist/docs/`);
if (errorCount > 0) {
  console.log(`⚠️  ${errorCount} files had errors`);
}

// Create a README in dist explaining the structure
const distReadme = `# Zen Style Design System - Distribution

## Folder Structure

\`\`\`
dist/
├── index.js                  # UMD bundle
├── index.esm.js              # ES Module bundle
├── index.webcomponents.js    # Web Components only
├── styles/
│   └── zen-style.css         # Compiled CSS
└── docs/                     # Documentation
    ├── .cursorrules          # AI agent reference
    ├── AGENTS.md             # Agent context
    └── README.md             # Getting started
\`\`\`

## Quick Setup

1. **Include in your HTML:**
   \`\`\`html
   <link rel="stylesheet" href="node_modules/zen-style/dist/styles/zen-style.css">
   <script src="node_modules/zen-style/dist/index.js"></script>
   \`\`\`

2. **Use components:**
   \`\`\`html
   <rw-button variant="primary">Click Me</rw-button>
   \`\`\`

## More Information

See the full documentation at: [Your docs URL]
`;

fs.writeFileSync(path.join(DIST_DIR, 'README.md'), distReadme);
console.log('📝 Created dist/README.md');

console.log('\n🎉 Build complete! AI docs are in dist/docs/');
