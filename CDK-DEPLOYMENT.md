# AWS CDK Deployment Guide

Deploy your dating app to AWS using Infrastructure as Code with AWS CDK.

## Why CDK?

- ✅ Infrastructure as Code (TypeScript)
- ✅ Automatic resource management
- ✅ Built-in best practices
- ✅ Easy updates and rollbacks
- ✅ Automatic CloudFront invalidation
- ✅ Version control your infrastructure

## Prerequisites

### 1. Install AWS CLI
```bash
brew install awscli
```

### 2. Configure AWS Credentials
```bash
aws configure
```

### 3. Install AWS CDK CLI
```bash
npm install -g aws-cdk
```

### 4. Verify Installation
```bash
cdk --version
aws --version
```

## Quick Deploy (Automated)

Use the deployment script:

```bash
cd cdk
./deploy.sh
```

This script will:
1. Install dependencies
2. Build the client app
3. Build the CDK stack
4. Bootstrap CDK (if needed)
5. Deploy to AWS
6. Show your live URL

## Manual Deploy (Step by Step)

### 1. Install CDK Dependencies
```bash
cd cdk
npm install
```

### 2. Build Client Application
```bash
cd ../client
npm install
npm run build
cd ../cdk
```

### 3. Bootstrap CDK (First Time Only)
```bash
cdk bootstrap
```

### 4. Preview Changes
```bash
cdk diff
```

### 5. Deploy Stack
```bash
cdk deploy
```

### 6. Get Your URL
After deployment, you'll see outputs:
```
Outputs:
DatingAppStack.WebsiteURL = https://d1234567890.cloudfront.net
DatingAppStack.BucketName = dating-app-123456789012-us-east-1
DatingAppStack.DistributionId = E1234567890ABC
```

## Update Deployment

After making changes to your app:

```bash
cd client
npm run build
cd ../cdk
cdk deploy
```

Or use the script:
```bash
cd cdk
./deploy.sh
```

## Destroy Stack

To remove all AWS resources:

```bash
cd cdk
./destroy.sh
```

Or manually:
```bash
cdk destroy
```

## What Gets Created

### S3 Bucket
- Private bucket (no public access)
- S3-managed encryption
- SSL enforcement
- Automatic cleanup on destroy

### CloudFront Distribution
- Global CDN
- HTTPS redirect
- Gzip compression
- SPA routing support (404 → index.html)
- Optimized caching

### Deployment
- Automatic file upload
- Cache control headers
- CloudFront invalidation
- Prune old files

## CDK Commands

```bash
# List all stacks
cdk list

# Show CloudFormation template
cdk synth

# Compare deployed stack with current state
cdk diff

# Deploy stack
cdk deploy

# Destroy stack
cdk destroy

# Show stack outputs
aws cloudformation describe-stacks \
  --stack-name DatingAppStack \
  --query 'Stacks[0].Outputs'
```

## Configuration

### Change Region

Edit `cdk/bin/app.ts`:
```typescript
region: 'us-west-2', // Your preferred region
```

### Production Settings

Edit `cdk/lib/dating-app-stack.ts`:

```typescript
// Keep bucket on stack deletion
removalPolicy: cdk.RemovalPolicy.RETAIN,
autoDeleteObjects: false,

// Enable CloudFront logging
enableLogging: true,
```

### Custom Domain

Add to `cdk/lib/dating-app-stack.ts`:

```typescript
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

// Import certificate (must be in us-east-1)
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:123456789012:certificate/...'
);

// Add to distribution
const distribution = new cloudfront.Distribution(this, 'Distribution', {
  domainNames: ['app.yourdomain.com'],
  certificate,
  // ... rest of config
});
```

## Cost Estimation

### Free Tier (First 12 Months)
- CloudFront: 1 TB data transfer + 10M requests/month
- S3: 5 GB storage + 20,000 GET requests
- **Cost**: $0-2/month

### After Free Tier
- S3: ~$0.023/GB/month
- CloudFront: $0.085/GB (first 10TB)
- **Estimated**: $5-20/month for moderate traffic

## Troubleshooting

### "CDK bootstrap required"
```bash
cdk bootstrap
```

### "Build directory not found"
```bash
cd client && npm run build
```

### "Permission denied"
Check IAM permissions for:
- CloudFormation
- S3
- CloudFront
- IAM (for deployment roles)

### Changes not appearing
CDK automatically invalidates cache. Wait 2-5 minutes and hard refresh (Cmd+Shift+R).

### Stack already exists
If deployment fails midway:
```bash
cdk deploy --force
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install CDK
        run: npm install -g aws-cdk
      
      - name: Build Client
        run: |
          cd client
          npm ci
          npm run build
      
      - name: Deploy CDK Stack
        run: |
          cd cdk
          npm ci
          npm run build
          cdk deploy --require-approval never
```

## Monitoring

### View Stack Status
```bash
aws cloudformation describe-stacks \
  --stack-name DatingAppStack
```

### View CloudFront Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=YOUR_DIST_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### View S3 Bucket Size
```bash
aws s3 ls s3://YOUR_BUCKET_NAME --recursive --summarize
```

## Security Features

- ✅ Private S3 bucket (no public access)
- ✅ CloudFront OAI for secure access
- ✅ HTTPS enforced
- ✅ SSL/TLS encryption
- ✅ Bucket encryption enabled
- ✅ SSL enforcement for S3

## Advantages Over CLI Scripts

| Feature | CDK | CLI Scripts |
|---------|-----|-------------|
| Infrastructure as Code | ✅ | ❌ |
| Version Control | ✅ | ❌ |
| Automatic Rollback | ✅ | ❌ |
| Change Preview | ✅ | ❌ |
| Resource Dependencies | ✅ | Manual |
| Updates | Easy | Complex |
| Reproducible | ✅ | ❌ |

## Support

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CDK Workshop](https://cdkworkshop.com/)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples)
- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/v2/)
