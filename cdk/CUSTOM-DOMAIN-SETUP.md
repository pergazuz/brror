# Custom Domain Setup Guide

This guide will help you set up a custom domain (like `app.yourdomain.com`) instead of the CloudFront URL.

## Prerequisites

You need to own a domain name. You can purchase one from:
- AWS Route 53: https://console.aws.amazon.com/route53/
- GoDaddy: https://www.godaddy.com
- Namecheap: https://www.namecheap.com
- Any other domain registrar

## Step 1: Request SSL Certificate

1. Go to AWS Certificate Manager (ACM): https://console.aws.amazon.com/acm/
2. **IMPORTANT**: Switch to **us-east-1** region (required for CloudFront)
3. Click "Request certificate"
4. Choose "Request a public certificate"
5. Enter your domain name:
   - For subdomain: `app.yourdomain.com`
   - For root domain: `yourdomain.com`
   - For both: `yourdomain.com` and `*.yourdomain.com` (wildcard)
6. Choose validation method:
   - **DNS validation** (recommended if you use Route 53)
   - **Email validation** (if domain is not in Route 53)
7. Click "Request"
8. Complete validation:
   - For DNS: Add the CNAME record shown to your DNS
   - For Email: Click the link in the validation email
9. Wait for status to change to "Issued" (can take 5-30 minutes)
10. **Copy the Certificate ARN** (looks like: `arn:aws:acm:us-east-1:123456789012:certificate/...`)

## Step 2: Update CDK Stack

Edit `cdk/lib/dating-app-stack.ts` and add your custom domain configuration:

```typescript
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

// Inside the DatingAppStack constructor, before creating the distribution:

// Import your certificate (replace with your ARN from Step 1)
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:YOUR_ACCOUNT_ID:certificate/YOUR_CERT_ID'
);

// Update the CloudFront Distribution configuration:
const distribution = new cloudfront.Distribution(this, 'Distribution', {
  // Add these lines:
  domainNames: ['app.yourdomain.com'], // Your custom domain
  certificate: certificate,
  
  // Keep existing configuration:
  defaultBehavior: {
    // ... existing config
  },
  // ... rest of config
});
```

## Step 3: Deploy Updated Stack

```bash
cd cdk
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="YOUR_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET"
export AWS_SESSION_TOKEN="YOUR_TOKEN"
npx cdk deploy --require-approval never
```

## Step 4: Add DNS Records

After deployment, you need to point your domain to CloudFront.

### Option A: Using Route 53 (AWS DNS)

1. Go to Route 53: https://console.aws.amazon.com/route53/
2. Click on your hosted zone
3. Click "Create record"
4. Configure:
   - Record name: `app` (for app.yourdomain.com) or leave empty (for yourdomain.com)
   - Record type: `A - IPv4 address`
   - Toggle "Alias" to ON
   - Route traffic to: "Alias to CloudFront distribution"
   - Choose your distribution from the dropdown
5. Click "Create records"

### Option B: Using External DNS Provider (GoDaddy, Namecheap, etc.)

1. Log into your domain registrar
2. Go to DNS management
3. Add a CNAME record:
   - Name/Host: `app` (for app.yourdomain.com)
   - Type: `CNAME`
   - Value/Points to: `d1v5nobzceku10.cloudfront.net` (your CloudFront domain)
   - TTL: `3600` or `Auto`
4. Save changes

**Note**: DNS changes can take 5 minutes to 48 hours to propagate worldwide.

## Step 5: Test Your Domain

After DNS propagation:

```bash
# Test DNS resolution
nslookup app.yourdomain.com

# Test HTTPS
curl -I https://app.yourdomain.com
```

Visit `https://app.yourdomain.com` in your browser!

## Quick Setup Example

Here's a complete example for `app.mydatingapp.com`:

### 1. Certificate ARN (from ACM)
```
arn:aws:acm:us-east-1:298937788917:certificate/12345678-1234-1234-1234-123456789012
```

### 2. Update CDK Stack
```typescript
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:298937788917:certificate/12345678-1234-1234-1234-123456789012'
);

const distribution = new cloudfront.Distribution(this, 'Distribution', {
  domainNames: ['app.mydatingapp.com'],
  certificate: certificate,
  // ... rest of config
});
```

### 3. Deploy
```bash
cd cdk && npx cdk deploy
```

### 4. DNS Record (Route 53)
- Type: A (Alias)
- Name: app
- Target: CloudFront distribution

## Troubleshooting

### Certificate validation stuck
- Check DNS records are correct
- Wait up to 30 minutes
- Ensure certificate is in us-east-1 region

### Domain not resolving
- Check DNS propagation: https://dnschecker.org
- Verify CNAME/A record is correct
- Wait for DNS propagation (up to 48 hours)

### SSL/HTTPS errors
- Ensure certificate covers your domain
- Check certificate is "Issued" status
- Verify domain name matches certificate

### CloudFront error
- Check domain is added to CloudFront distribution
- Verify certificate ARN is correct
- Ensure certificate is in us-east-1

## Cost

- **SSL Certificate**: FREE (AWS Certificate Manager)
- **Route 53 Hosted Zone**: $0.50/month (if using Route 53)
- **DNS Queries**: $0.40 per million queries
- **Domain Registration**: Varies ($12-50/year depending on TLD)

## Alternative: Free Subdomain

If you don't want to buy a domain, you can use free services:

1. **Freenom** (free domains): http://www.freenom.com
2. **DuckDNS** (free subdomain): https://www.duckdns.org
3. **No-IP** (free subdomain): https://www.noip.com

Note: Free domains may have limitations and are not recommended for production.

## Need Help?

- AWS Certificate Manager: https://docs.aws.amazon.com/acm/
- CloudFront Custom Domains: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html
- Route 53 Documentation: https://docs.aws.amazon.com/route53/
