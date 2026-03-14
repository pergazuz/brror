#!/bin/bash

# AWS Deployment Script - Deploy built app to S3 and invalidate CloudFront cache
# Usage: ./deploy/deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploying to AWS ===${NC}"
echo ""

# Load configuration
if [ ! -f "deploy/aws-config.env" ]; then
    echo -e "${RED}Error: aws-config.env not found${NC}"
    echo "Run ./deploy/aws-setup.sh first"
    exit 1
fi

source deploy/aws-config.env

# Check if build directory exists
if [ ! -d "client/dist" ]; then
    echo -e "${RED}Error: Build directory not found${NC}"
    echo "Run: cd client && npm run build"
    exit 1
fi

echo -e "${YELLOW}Step 1: Syncing files to S3...${NC}"
aws s3 sync client/dist/ "s3://$BUCKET_NAME/" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.map"

# Upload index.html with no-cache
aws s3 cp client/dist/index.html "s3://$BUCKET_NAME/index.html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html"

echo -e "${GREEN}✓ Files uploaded to S3${NC}"

echo -e "${YELLOW}Step 2: Creating CloudFront invalidation...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✓ Invalidation created: $INVALIDATION_ID${NC}"

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "Your app is available at: ${YELLOW}https://$CLOUDFRONT_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Note: CloudFront cache invalidation may take a few minutes.${NC}"
echo ""
