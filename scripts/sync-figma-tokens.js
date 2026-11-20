#!/usr/bin/env node

/**
 * Figma Token Sync Utility
 * 
 * This script helps synchronize design tokens between Figma and the codebase.
 * It can be used to:
 * 1. Compare Figma tokens with existing SCSS variables
 * 2. Generate reports of mismatches
 * 3. Create update suggestions
 * 
 * Usage:
 *   node scripts/sync-figma-tokens.js --compare <figma-tokens.json>
 *   node scripts/sync-figma-tokens.js --report
 *   node scripts/sync-figma-tokens.js --validate
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse SCSS file and extract variable definitions
 */
function parseScssVariables(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const variables = {};
    
    // Match SCSS variable definitions: $variable-name: value;
    const regex = /\$([a-zA-Z0-9-_]+):\s*([^;]+);/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const value = match[2].trim();
        variables[name] = value;
    }
    
    return variables;
}

/**
 * Load the figma-code-map.json file
 */
function loadFigmaCodeMap() {
    const mapPath = path.join(process.cwd(), 'figma-code-map.json');
    if (!fs.existsSync(mapPath)) {
        log('Error: figma-code-map.json not found', 'red');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
}

/**
 * Generate a report of current token mappings
 */
function generateReport() {
    log('\n📊 Design Token Sync Report', 'blue');
    log('=' .repeat(50), 'blue');
    
    const map = loadFigmaCodeMap();
    const tokensDir = path.join(process.cwd(), 'src', 'styles', 'tokens');
    
    // Parse all token files
    const tokenFiles = {
        colors: parseScssVariables(path.join(tokensDir, '_colors.scss')),
        typography: parseScssVariables(path.join(tokensDir, '_typography.scss')),
        spacing: parseScssVariables(path.join(tokensDir, '_spacing.scss')),
        effects: parseScssVariables(path.join(tokensDir, '_effects.scss'))
    };
    
    // Report on each token type
    Object.entries(tokenFiles).forEach(([type, variables]) => {
        log(`\n📦 ${type.charAt(0).toUpperCase() + type.slice(1)} Tokens`, 'cyan');
        log(`   Found ${Object.keys(variables).length} variables`, 'reset');
        
        // Check mappings
        const mappings = map.tokens[type]?.mappings || [];
        const mapped = mappings.filter(m => variables[m.scss.replace('$', '')]);
        const unmapped = Object.keys(variables).filter(v => 
            !mappings.some(m => m.scss === `$${v}`)
        );
        
        log(`   Mapped: ${mapped.length}`, 'green');
        log(`   Unmapped: ${unmapped.length}`, unmapped.length > 0 ? 'yellow' : 'green');
        
        if (unmapped.length > 0 && unmapped.length <= 10) {
            unmapped.forEach(v => log(`     - $${v}`, 'yellow'));
        }
    });
    
    // Report on components
    log('\n🧩 Components', 'cyan');
    map.components.forEach(comp => {
        const hasNodeId = comp.figmaNodeId && comp.figmaNodeId !== '';
        const status = hasNodeId ? '✓' : '○';
        const color = hasNodeId ? 'green' : 'yellow';
        log(`   ${status} ${comp.figmaName} → ${comp.codeLocation}`, color);
    });
    
    log('\n' + '=' .repeat(50), 'blue');
    log('Run with --validate to check for issues', 'reset');
}

/**
 * Validate token files and mappings
 */
function validateTokens() {
    log('\n🔍 Validating Design Tokens...', 'blue');
    
    const map = loadFigmaCodeMap();
    const tokensDir = path.join(process.cwd(), 'src', 'styles', 'tokens');
    const issues = [];
    
    // Check token files exist
    const requiredFiles = ['_colors.scss', '_typography.scss', '_spacing.scss', '_effects.scss'];
    requiredFiles.forEach(file => {
        const filePath = path.join(tokensDir, file);
        if (!fs.existsSync(filePath)) {
            issues.push({ type: 'error', message: `Missing token file: ${file}` });
        }
    });
    
    // Check component files exist
    map.components.forEach(comp => {
        const compPath = path.join(process.cwd(), comp.codeLocation);
        if (!fs.existsSync(compPath)) {
            issues.push({ 
                type: 'warning', 
                message: `Component file not found: ${comp.codeLocation} (${comp.figmaName})` 
            });
        }
    });
    
    // Check documentation files exist
    map.components.forEach(comp => {
        if (comp.documentation) {
            const docPath = path.join(process.cwd(), comp.documentation);
            if (!fs.existsSync(docPath)) {
                issues.push({ 
                    type: 'warning', 
                    message: `Documentation missing: ${comp.documentation} (${comp.figmaName})` 
                });
            }
        }
    });
    
    // Report issues
    if (issues.length === 0) {
        log('\n✅ All validations passed!', 'green');
    } else {
        log(`\n⚠️  Found ${issues.length} issues:`, 'yellow');
        issues.forEach(issue => {
            const color = issue.type === 'error' ? 'red' : 'yellow';
            const icon = issue.type === 'error' ? '❌' : '⚠️';
            log(`   ${icon} ${issue.message}`, color);
        });
    }
}

/**
 * Compare Figma tokens with codebase
 */
function compareTokens(figmaTokensFile) {
    if (!fs.existsSync(figmaTokensFile)) {
        log(`Error: File not found: ${figmaTokensFile}`, 'red');
        process.exit(1);
    }
    
    log('\n🔄 Comparing Figma tokens with codebase...', 'blue');
    
    const figmaTokens = JSON.parse(fs.readFileSync(figmaTokensFile, 'utf-8'));
    const tokensDir = path.join(process.cwd(), 'src', 'styles', 'tokens');
    const codeTokens = parseScssVariables(path.join(tokensDir, '_colors.scss'));
    
    const differences = [];
    
    // Compare each Figma token with code
    Object.entries(figmaTokens).forEach(([name, value]) => {
        const scssName = name.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
        const codeValue = codeTokens[scssName] || codeTokens[`color-${scssName}`];
        
        if (!codeValue) {
            differences.push({ 
                type: 'missing', 
                figmaName: name, 
                figmaValue: value,
                suggestedScss: `$${scssName}` 
            });
        } else if (codeValue.toLowerCase() !== value.toLowerCase()) {
            differences.push({ 
                type: 'mismatch', 
                figmaName: name, 
                figmaValue: value,
                codeValue: codeValue,
                scssName: scssName
            });
        }
    });
    
    if (differences.length === 0) {
        log('\n✅ All tokens match!', 'green');
    } else {
        log(`\n📋 Found ${differences.length} differences:`, 'yellow');
        
        differences.filter(d => d.type === 'missing').forEach(d => {
            log(`\n   ➕ NEW: ${d.figmaName}`, 'cyan');
            log(`      Value: ${d.figmaValue}`, 'reset');
            log(`      Suggested: ${d.suggestedScss}: ${d.figmaValue};`, 'green');
        });
        
        differences.filter(d => d.type === 'mismatch').forEach(d => {
            log(`\n   🔄 CHANGED: ${d.figmaName}`, 'yellow');
            log(`      Figma:  ${d.figmaValue}`, 'reset');
            log(`      Code:   ${d.codeValue}`, 'reset');
        });
    }
}

/**
 * Print usage information
 */
function printUsage() {
    log('\nFigma Token Sync Utility', 'blue');
    log('========================\n', 'blue');
    log('Usage:', 'cyan');
    log('  node scripts/sync-figma-tokens.js --report', 'reset');
    log('    Generate a report of current token mappings\n', 'reset');
    log('  node scripts/sync-figma-tokens.js --validate', 'reset');
    log('    Validate token files and component mappings\n', 'reset');
    log('  node scripts/sync-figma-tokens.js --compare <figma-tokens.json>', 'reset');
    log('    Compare Figma tokens file with codebase\n', 'reset');
    log('Workflow:', 'cyan');
    log('  1. Extract tokens from Figma using MCP tool "get_variable_defs"', 'reset');
    log('  2. Save the output as figma-tokens.json', 'reset');
    log('  3. Run: node scripts/sync-figma-tokens.js --compare figma-tokens.json', 'reset');
    log('  4. Review differences and update SCSS files as needed', 'reset');
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
} else if (args.includes('--report')) {
    generateReport();
} else if (args.includes('--validate')) {
    validateTokens();
} else if (args.includes('--compare')) {
    const fileIndex = args.indexOf('--compare') + 1;
    if (fileIndex < args.length) {
        compareTokens(args[fileIndex]);
    } else {
        log('Error: Please provide a Figma tokens file path', 'red');
        printUsage();
    }
} else {
    log('Unknown command', 'red');
    printUsage();
}
