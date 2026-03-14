# Quick Start - Deploy to AWS

Choose your deployment method:

## Option 1: AWS CDK (Recommended) 🚀

Infrastructure as Code with TypeScript - easier to manage and update.

```bash
# 1. Install prerequisites
brew install awscli
npm install -g aws-cdk
aws configure

# 2. Deploy (automated script)
cd cdk
./deploy.sh
```

**Done!** Your app is live at the CloudFront URL shown.

[Full CDK Guide →](CDK-DEPLOYMENT.md)

---

## Option 2: AWS CLI Scripts

Direct AWS CLI commands - simpler but less maintainable.

```bash
# 1. Install AWS CLI
brew install awscli
aws configure

# 2. Setup infrastructure (one-time)
./deploy/aws-setup.sh

# 3. Build and deploy
cd client && npm run build && cd ..
./deploy/deploy.sh
```

[Full CLI Guide →](deploy/README.md)

---

## Comparison

| Feature | CDK | CLI Scripts |
|---------|-----|-------------|
| Setup Time | 5 min | 20 min |
| Infrastructure as Code | ✅ | ❌ |
| Easy Updates | ✅ | ❌ |
| Rollback Support | ✅ | ❌ |
| Learning Curve | Medium | Low |
| Best For | Production | Quick tests |

## What You Get

- ✅ Private S3 bucket
- ✅ CloudFront CDN with HTTPS
- ✅ Global distribution
- ✅ Automatic cache invalidation
- ✅ SPA routing support
- ✅ ~$1-5/month cost

## Next Steps

After deployment:
1. Visit your CloudFront URL
2. Test the app
3. Set up custom domain (optional)
4. Configure CI/CD (optional)

## Need Help?

- CDK issues: See [CDK-DEPLOYMENT.md](CDK-DEPLOYMENT.md)
- CLI issues: See [deploy/README.md](deploy/README.md)
- App issues: See [README.md](README.md)
