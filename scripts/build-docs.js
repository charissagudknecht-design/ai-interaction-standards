#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

function cleanDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

async function buildDocs() {
    try {
        log('🚀 Starting documentation build...', 'blue');

        // Define paths
        const buildDir = path.join(process.cwd(), 'build');
        const docsDir = path.join(process.cwd(), 'docs');
        const distDir = path.join(process.cwd(), 'dist');

        // Step 1: Clean build directory
        log('\n📦 Cleaning build directory...', 'yellow');
        cleanDirectory(buildDir);
        fs.mkdirSync(buildDir, { recursive: true });

        // Step 2: Build JS bundles and CSS
        log('\n🔨 Building JS bundles and CSS...', 'yellow');
        try {
            execSync('npm run build', { stdio: 'inherit' });
            log('✓ JS and CSS built successfully', 'green');
        } catch (error) {
            log('✗ Build failed', 'red');
            throw error;
        }

        // Step 3: Copy all HTML files from docs (with path fixes for S3 hosting)
        log('\n📄 Copying HTML documentation files...', 'yellow');
        const htmlFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.html'));
        htmlFiles.forEach(file => {
            let content = fs.readFileSync(path.join(docsDir, file), 'utf8');
            
            // Fix paths for S3 hosting (files are served from root, not a subdirectory)
            // ../dist/ -> ./dist/ (CSS/JS references)
            content = content.replace(/\.\.\/dist\//g, './dist/');
            // ../docs/fonts/ -> ./fonts/ (font references within docs)
            content = content.replace(/\.\.\/docs\/fonts\//g, './fonts/');
            // ../docs/images/ -> ./images/ (image references)
            content = content.replace(/\.\.\/docs\/images\//g, './images/');
            // ../src/ -> ./dist/ (component imports)
            content = content.replace(/\.\.\/src\/index\.js/g, './dist/index.esm.js');
            content = content.replace(/from ['"]\.\.\/src\//g, 'from \'./dist/');
            
            fs.writeFileSync(path.join(buildDir, file), content);
        });
        log(`✓ Copied ${htmlFiles.length} HTML files (paths fixed)`, 'green');

        // Step 4: Copy documentation assets
        log('\n🖼️  Copying documentation assets...', 'yellow');
        
        // Copy docs/styles
        if (fs.existsSync(path.join(docsDir, 'styles'))) {
            copyDirectory(
                path.join(docsDir, 'styles'),
                path.join(buildDir, 'styles')
            );
            log('✓ Copied styles', 'green');
        }

        // Copy docs/scripts
        if (fs.existsSync(path.join(docsDir, 'scripts'))) {
            copyDirectory(
                path.join(docsDir, 'scripts'),
                path.join(buildDir, 'scripts')
            );
            log('✓ Copied scripts', 'green');
        }

        // Copy docs/fonts
        if (fs.existsSync(path.join(docsDir, 'fonts'))) {
            copyDirectory(
                path.join(docsDir, 'fonts'),
                path.join(buildDir, 'fonts')
            );
            log('✓ Copied fonts', 'green');
        }

        // Copy docs/images
        if (fs.existsSync(path.join(docsDir, 'images'))) {
            copyDirectory(
                path.join(docsDir, 'images'),
                path.join(buildDir, 'images')
            );
            log('✓ Copied images', 'green');
        }

        // Step 5: Copy icon-font.css
        log('\n🔤 Copying icon font CSS...', 'yellow');
        if (fs.existsSync(path.join(docsDir, 'icon-font.css'))) {
            copyFile(
                path.join(docsDir, 'icon-font.css'),
                path.join(buildDir, 'icon-font.css')
            );
            log('✓ Copied icon-font.css', 'green');
        }

        // Step 6: Copy built CSS from dist
        log('\n💅 Copying compiled CSS...', 'yellow');
        if (fs.existsSync(distDir)) {
            copyDirectory(distDir, path.join(buildDir, 'dist'));
            log('✓ Copied dist files', 'green');
        }

        // Note: Component JavaScript is now bundled in dist/index.esm.js
        // Documentation HTML files import directly from the dist bundle
        // This ensures docs use the same bundled code that consumers will use

        // Step 7: Create a simple index redirect if needed
        if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
            log('\n🏠 Creating index.html redirect...', 'yellow');
            const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=./index.html">
    <title>Rosewood Design System</title>
</head>
<body>
    <p>Redirecting to documentation...</p>
</body>
</html>`;
            fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
            log('✓ Created index.html', 'green');
        }

        // Step 8: Generate build info
        log('\n📝 Generating build info...', 'yellow');
        const buildInfo = {
            buildDate: new Date().toISOString(),
            version: require('../package.json').version,
            files: {
                html: htmlFiles.length,
                total: countFiles(buildDir)
            }
        };
        fs.writeFileSync(
            path.join(buildDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
        log('✓ Build info generated', 'green');

        // Summary
        log('\n✅ Documentation build completed successfully!', 'green');
        log(`\n📊 Build Summary:`, 'blue');
        log(`   Output directory: ${buildDir}`, 'reset');
        log(`   HTML files: ${buildInfo.files.html}`, 'reset');
        log(`   Total files: ${buildInfo.files.total}`, 'reset');
        log(`\n🚀 Ready to deploy to S3!`, 'green');

    } catch (error) {
        log(`\n❌ Build failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

function countFiles(dir) {
    let count = 0;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        if (item.isDirectory()) {
            count += countFiles(path.join(dir, item.name));
        } else {
            count++;
        }
    }
    
    return count;
}

// Run the build
buildDocs();
