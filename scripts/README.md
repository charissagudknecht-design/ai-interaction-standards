# Build Scripts Documentation

## Overview

This directory contains build scripts for the Rosewood Design System documentation.

## Scripts

### `build-docs.js`

Builds the complete documentation package ready for deployment to S3.

**What it does:**
1. Cleans the `build/` directory
2. Compiles SCSS to CSS
3. Copies all HTML documentation files
4. Copies documentation assets (styles, scripts, fonts, images)
5. Copies compiled CSS and component JavaScript
6. Generates build information

**Output Directory Structure:**
```
build/
├── index.html                 # Main documentation index
├── button-components.html     # Component documentation pages
├── checkbox-components.html
├── ... (all other .html files)
├── dist/
│   └── styles/
│       └── main.css          # Compiled component styles
├── styles/
│   └── documentation.css     # Documentation-specific styles
├── scripts/
│   └── documentation.js      # Documentation JavaScript
├── fonts/
│   └── icon-font/           # Icon fonts
├── images/                   # Documentation images
├── src/
│   └── components/          # Component JavaScript
│       ├── Switch/
│       ├── DropdownMenu/
│       └── Button/
├── icon-font.css            # Icon font CSS
└── build-info.json          # Build metadata
```

## NPM Scripts

### Development

```bash
# Start development server with auto-rebuild
npm run dev

# Watch styles only
npm run watch:styles

# Serve current directory
npm run serve

# Serve built documentation
npm run serve:build
```

### Building

```bash
# Build documentation for deployment
npm run build:docs

# Build styles only
npm run build:styles
```

### Deployment

```bash
# Deploy to S3 (default bucket)
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod

# Dry run (preview what would be deployed)
npm run deploy:dry-run
```

## S3 Deployment Configuration

Update the bucket names in `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build:docs && aws s3 sync build/ s3://your-bucket-name/ --delete",
    "deploy:staging": "npm run build:docs && aws s3 sync build/ s3://staging-bucket-name/ --delete --cache-control 'max-age=3600'",
    "deploy:prod": "npm run build:docs && aws s3 sync build/ s3://prod-bucket-name/ --delete --cache-control 'max-age=86400'"
  }
}
```

### AWS Configuration Required

Before deploying, ensure you have:

1. **AWS CLI installed**
   ```bash
   aws --version
   ```

2. **AWS credentials configured**
   ```bash
   aws configure
   ```

3. **S3 bucket created** with:
   - Public read access (for documentation)
   - Static website hosting enabled
   - CORS configuration (if needed)

### S3 Bucket Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### Static Website Configuration

Enable static website hosting on your S3 bucket:
- **Index document**: `index.html`
- **Error document**: `index.html` (for SPA-like behavior)

## Cache Control

The deploy scripts include cache control headers:

- **Staging**: `max-age=3600` (1 hour) - for frequent updates
- **Production**: `max-age=86400` (24 hours) - for stable releases

Adjust these values in `package.json` based on your needs.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build documentation
        run: npm run build:docs
        
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: npm run deploy:prod
```

## Troubleshooting

### Build fails on Windows

If you encounter path issues on Windows, ensure you're using a compatible terminal (PowerShell, Git Bash, or WSL).

### AWS CLI errors

- Verify AWS credentials: `aws sts get-caller-identity`
- Check bucket permissions
- Ensure bucket exists: `aws s3 ls s3://your-bucket-name`

### Missing files in build

The build script copies specific directories. If you add new asset directories, update `scripts/build-docs.js` to include them.

## Local Testing

After building, test the documentation locally:

```bash
npm run build:docs
npm run serve:build
```

Visit `http://localhost:8082` to verify the build.
