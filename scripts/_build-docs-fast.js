/**
 * Fast docs build — skips Rollup (assumes dist/ is already fresh).
 * Copies docs/ HTML (with path fixes) + assets + dist/ into build/.
 */
const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : copyFile(s, d);
  });
}

function countFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) =>
    n + (e.isDirectory() ? countFiles(path.join(dir, e.name)) : 1), 0);
}

const ROOT  = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const DOCS  = path.join(ROOT, 'docs');
const DIST  = path.join(ROOT, 'dist');

console.log('Cleaning build/...');
if (fs.existsSync(BUILD)) fs.rmSync(BUILD, { recursive: true, force: true });
fs.mkdirSync(BUILD, { recursive: true });

// HTML files — fix relative paths for flat static hosting
console.log('Copying HTML files...');
const htmlFiles = fs.readdirSync(DOCS).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  let c = fs.readFileSync(path.join(DOCS, file), 'utf8');
  c = c.replace(/\.\.\/dist\//g,        './dist/');
  c = c.replace(/\.\.\/docs\/fonts\//g,  './fonts/');
  c = c.replace(/\.\.\/docs\/images\//g, './images/');
  fs.writeFileSync(path.join(BUILD, file), c);
});
console.log(`  ${htmlFiles.length} HTML files copied`);

// Doc assets
['styles', 'scripts', 'fonts', 'images'].forEach(d => {
  const src = path.join(DOCS, d);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(BUILD, d));
    console.log(`  Copied docs/${d}/`);
  }
});

if (fs.existsSync(path.join(DOCS, 'icon-font.css'))) {
  copyFile(path.join(DOCS, 'icon-font.css'), path.join(BUILD, 'icon-font.css'));
  console.log('  Copied icon-font.css');
}

// Compiled dist assets
console.log('Copying dist/ ...');
copyDir(DIST, path.join(BUILD, 'dist'));

console.log(`\nDone! ${countFiles(BUILD)} files in build/`);
