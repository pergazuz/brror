# Dating App - AWS CDK Deployment

This directory contains AWS CDK infrastructure code to deploy the dating app to S3 and CloudFront.

## Prerequisites

1. **Node.js** (v18 or later)
2. **AWS CLI** configured with credentials:
   ```bash
   aws configure
   ```
3. **AWS CDK CLI** installed globally:
   ```bash
   npm install -g aws-cdk
   ```

## Quick Start

### 1. Install Dependencies

```bash
cd cdk
npm install
```

### 2. Build the Client Application

```bash
cd ../client
npm install
npm run build
cd ../cdk
```

### 3. Bootstrap CDK (First Time Only)

If this is your first time using CDK in this AWS account/region:

```bash
cdk bootstrap
```

### 4. Deploy the Stack

```bash
cdk deploy
```

You'll see a preview of changes and be asked to confirm. Type `y` to proceed.

After deployment completes, you'll see outputs including:
- **WebsiteURL**: Your CloudFront URL (e.g., https://d1234567890.cloudfront.net)
- **BucketName**: S3 bucket name
- **DistributionId**: CloudFront distribution ID

## CDK Commands

### Preview Changes
```bash
cdk diff
```

### Synthesize CloudFormation Template
```bash
cdk synth
```

### Deploy Stack
```bash
cdk deploy
```

### Destroy Stack (Remove All Resources)
```bash
cdk destroy
```

### List All Stacks
```bash
cdk list
```

## Update Deployment

After making changes to your app:

```bash
# 1. Build the client
cd ../client
npm run build

# 2. Deploy updates
cd ../cdk
cdk deploy
```

CDK will automatically:
- Upload new files to S3
- Invalidate CloudFront cache
- Update only what changed

## Architecture

The CDK stack creates:

1. **S3 Bucket** (Private)
   - Block all public access
   - S3-managed encryption
   - Auto-delete on stack destroy (configurable)

2. **CloudFront Distribution**
   - Origin Access Identity for secure S3 access
   - HTTPS redirect enabled
   - Gzip compression enabled
   - Custom error responses for SPA routing
   - Optimized caching policy

3. **Deployment**
   - Automatic upload of built files
   - Cache control headers
   - CloudFront invalidation

## Configuration

### Change Region

Edit `cdk/bin/app.ts`:
```typescript
region: 'us-west-2', // Change to your preferred region
```

### Production Settings

For production, update `cdk/lib/dating-app-stack.ts`:

```typescript
// Change removal policy
removalPolicy: cdk.RemovalPolicy.RETAIN,
autoDeleteObjects: false,

// Enable CloudFront logging
enableLogging: true,
logBucket: logBucket, // Create a separate log bucket
```

### Custom Domain

To add a custom domain, update the distribution:

```typescript
domainNames: ['app.yourdomain.com'],
certificate: certificate, // Import ACM certificate
```

## Cost Estimation

### Development/Testing
- S3: ~$0.023/GB/month
- CloudFront: Free tier (1TB + 10M requests/month for 12 months)
- **Estimated**: $1-5/month

### Production (after free tier)
- S3: ~$0.023/GB/month
- CloudFront: $0.085/GB (first 10TB)
- **Estimated**: $10-50/month for moderate traffic

## Troubleshooting

### Build Directory Not Found

Ensure you've built the client app:
```bash
cd client && npm run build
```

### CDK Bootstrap Required

If you see "CDK bootstrap required":
```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Permission Errors

Ensure your AWS credentials have permissions for:
- S3 (create buckets, upload objects)
- CloudFront (create distributions)
- IAM (create roles for deployment)
- CloudFormation (create stacks)

### Changes Not Appearing

CDK automatically invalidates CloudFront cache, but it may take 2-5 minutes. Force refresh your browser (Cmd+Shift+R).

## Stack Outputs

After deployment, retrieve outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name DatingAppStack \
  --query 'Stacks[0].Outputs'
```

## CI/CD Integration

### GitHub Actions Example

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
      
      - name: Build Client
        run: |
          cd client
          npm ci
          npm run build
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy CDK Stack
        run: |
          cd cdk
          npm ci
          npm run build
          cdk deploy --require-approval never
```

## Security Best Practices

1. ✅ S3 bucket is private (no public access)
2. ✅ CloudFront uses OAI for secure S3 access
3. ✅ HTTPS enforced (HTTP redirects to HTTPS)
4. ✅ SSL/TLS encryption enabled
5. ✅ Bucket encryption enabled
6. ✅ Enforce SSL for S3 access

## Monitoring

### CloudWatch Metrics

View CloudFront metrics:
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=YOUR_DISTRIBUTION_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Enable CloudFront Logging

Uncomment logging configuration in `dating-app-stack.ts` and create a log bucket.

## Support

For CDK issues:
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/v2/)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples)
