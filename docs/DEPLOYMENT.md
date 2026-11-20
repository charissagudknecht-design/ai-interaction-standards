# Deployment (CI/CD)

The repo uses **GitHub Actions** to build and deploy the documentation site to **Amazon S3**.

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| **CI** (`.github/workflows/ci.yml`) | Every push and every PR to `main`/`master` | Runs `npm ci`, lint, format check, tests, `npm run build`, and `npm run build:docs` to verify the project builds. |
| **Deploy to S3** (`.github/workflows/deploy.yml`) | Push to `main`/`master`, or manual run | Runs `npm run build:docs`, then syncs the `build/` folder to the configured S3 bucket with `aws s3 sync build/ s3://<bucket>/ --delete`. |

## Required GitHub secrets (for Deploy to S3)

Configure these in the repo: **Settings → Secrets and variables → Actions**.

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for an IAM user/role that can write to the bucket. |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for the above. |
| `AWS_S3_BUCKET` | Target S3 bucket name (e.g. `my-zen-style-docs`). |
| `AWS_REGION` | (Optional) AWS region for the bucket; defaults to `us-east-1` if not set. |

## S3 and static website (optional)

To serve the site as a static website from S3:

1. Create an S3 bucket and enable **Static website hosting** (or use the bucket for CloudFront origin).
2. Set a **Bucket policy** so the bucket is readable (e.g. by CloudFront or by public read if you want public docs).
3. If using **CloudFront**, create a distribution with the bucket as origin and (recommended) use the distribution URL for the docs site.

The workflow only uploads files; it does not configure bucket hosting or CloudFront.

## Manual deploy

1. Go to **Actions → Deploy to S3**.
2. Click **Run workflow**, choose branch.
3. Optionally set:
   - **bucket** – overrides the `AWS_S3_BUCKET` secret for this run.
   - **cache_control** – e.g. `max-age=86400` for production.

## Local deploy (without CI)

From the repo root:

```bash
npm run build:docs
aws s3 sync build/ s3://YOUR_BUCKET_NAME/ --delete
```

Use `--cache-control 'max-age=3600'` or `max-age=86400` as needed. Ensure AWS CLI is configured (`aws configure` or env vars).
