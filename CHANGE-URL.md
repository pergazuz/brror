# How to Change Your CloudFront URL to a Custom Domain

Your app is currently at: `https://d1v5nobzceku10.cloudfront.net`

To change it to your own domain (like `app.yourdomain.com`), follow these steps:

## Quick Summary

1. **Buy a domain** (if you don't have one)
2. **Request SSL certificate** in AWS Certificate Manager
3. **Update CDK stack** with your domain
4. **Deploy**
5. **Add DNS records**

## Detailed Steps

### Step 1: Get a Domain Name

If you don't have a domain, buy one from:
- **AWS Route 53**: https://console.aws.amazon.com/route53/ ($12-50/year)
- **Namecheap**: https://www.namecheap.com ($8-15/year)
- **GoDaddy**: https://www.godaddy.com ($10-20/year)

Example domains:
- `mydatingapp.com`
- `loveconnect.app`
- `matchmaker.io`

### Step 2: Request SSL Certificate (FREE)

1. Go to AWS Certificate Manager: https://console.aws.amazon.com/acm/
2. **Switch to us-east-1 region** (top right corner - REQUIRED!)
3. Click "Request certificate"
4. Choose "Request a public certificate"
5. Enter domain name: `app.yourdomain.com` (or `yourdomain.com`)
6. Choose "DNS validation"
7. Click "Request"
8. Click on the certificate
9. Click "Create records in Route 53" (if using Route 53) OR manually add the CNAME record to your DNS
10. Wait for status to become "Issued" (5-30 minutes)
11. **Copy the Certificate ARN** (looks like: `arn:aws:acm:us-east-1:123456789012:certificate/abc123...`)

### Step 3: Update CDK Stack

Edit `cdk/lib/dating-app-stack.ts`:

```typescript
// Add this import at the top
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

// Inside the constructor, before creating the distribution:

// Add your certificate ARN here
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:298937788917:certificate/YOUR_CERT_ID_HERE'
);

// Add your custom domain
const customDomain = 'app.yourdomain.com';

// Update the CloudFront Distribution:
const distribution = new cloudfront.Distribution(this, 'Distribution', {
  // Add these two lines:
  domainNames: [customDomain],
  certificate: certificate,
  
  // Keep all existing configuration below...
  defaultBehavior: {
    // ... existing config
  },
  // ... rest stays the same
});
```

### Step 4: Deploy

```bash
cd cdk
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="YOUR_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET"
export AWS_SESSION_TOKEN="YOUR_TOKEN"
npx cdk deploy --require-approval never
```

### Step 5: Add DNS Records

#### If using Route 53:

1. Go to Route 53: https://console.aws.amazon.com/route53/
2. Click your hosted zone
3. Click "Create record"
4. Settings:
   - Record name: `app` (for app.yourdomain.com)
   - Record type: `A`
   - Toggle "Alias" to ON
   - Route traffic to: "Alias to CloudFront distribution"
   - Choose your distribution
5. Click "Create records"

#### If using other DNS provider (GoDaddy, Namecheap, etc.):

1. Log into your domain provider
2. Go to DNS settings
3. Add CNAME record:
   - Host: `app`
   - Points to: `d1v5nobzceku10.cloudfront.net`
   - TTL: 3600
4. Save

### Step 6: Wait & Test

DNS changes take 5 minutes to 48 hours to propagate.

Test your domain:
```bash
# Check DNS
nslookup app.yourdomain.com

# Test HTTPS
curl -I https://app.yourdomain.com
```

Visit `https://app.yourdomain.com` in your browser!

## Complete Example

Let's say you want `app.mydatingapp.com`:

### 1. Certificate ARN (from Step 2)
```
arn:aws:acm:us-east-1:298937788917:certificate/12345678-abcd-1234-abcd-123456789012
```

### 2. Update `cdk/lib/dating-app-stack.ts`
```typescript
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

// In constructor:
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:298937788917:certificate/12345678-abcd-1234-abcd-123456789012'
);

const customDomain = 'app.mydatingapp.com';

const distribution = new cloudfront.Distribution(this, 'Distribution', {
  domainNames: [customDomain],
  certificate: certificate,
  // ... rest of config
});
```

### 3. Deploy
```bash
cd cdk && npx cdk deploy
```

### 4. DNS (Route 53)
- Type: A (Alias)
- Name: app
- Target: CloudFront distribution

Done! Visit `https://app.mydatingapp.com`

## Troubleshooting

**Certificate stuck on "Pending validation"**
- Check DNS records are added correctly
- Wait up to 30 minutes
- Certificate must be in us-east-1 region

**Domain not working**
- Check DNS propagation: https://dnschecker.org
- Wait up to 48 hours for DNS
- Clear browser cache

**SSL errors**
- Verify certificate is "Issued"
- Check domain name matches certificate
- Ensure certificate is in us-east-1

## Cost

- SSL Certificate: **FREE**
- Route 53 Hosted Zone: **$0.50/month** (if using Route 53)
- Domain Registration: **$12-50/year** (varies by TLD)

## Don't Want to Buy a Domain?

You can keep using the CloudFront URL: `https://d1v5nobzceku10.cloudfront.net`

It works perfectly fine, just not as memorable!

## Need More Help?

See detailed guide: `cdk/CUSTOM-DOMAIN-SETUP.md`
