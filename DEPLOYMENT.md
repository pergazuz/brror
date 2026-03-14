# Quick Deployment Guide

## Prerequisites

Install AWS CLI on macOS:
```bash
brew install awscli
```

Configure AWS credentials:
```bash
aws configure
```

## Deploy in 3 Steps

### 1. Setup AWS Infrastructure (One-time)
```bash
chmod +x deploy/*.sh
./deploy/aws-setup.sh
```
⏱️ Takes 15-20 minutes for CloudFront to deploy

### 2. Build the Application
```bash
cd client
npm install
npm run build
cd ..
```

### 3. Deploy to AWS
```bash
./deploy/deploy.sh
```

Your app will be live at the CloudFront URL shown in the output!

## Update Deployment

After making changes:
```bash
cd client && npm run build && cd ..
./deploy/deploy.sh
```

## Remove Everything

To delete all AWS resources:
```bash
./deploy/teardown.sh
```

## What Gets Created

- ✅ Private S3 bucket (no public access)
- ✅ CloudFront distribution (global CDN)
- ✅ Origin Access Identity (secure S3 access)
- ✅ HTTPS enabled by default
- ✅ SPA routing support (404 → index.html)

## Cost

Estimated $1-5/month for low traffic (Free tier: 1TB + 10M requests/month for first year)

## Need Help?

See detailed guide: `deploy/README.md`
