#!/bin/bash

# AWS S3 + CloudFront Deployment Setup Script for macOS
# This script creates the infrastructure for hosting a static web app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="dating-app-frontend-$(date +%s)"
REGION="us-east-1"
CLOUDFRONT_COMMENT="Dating App Distribution"

echo -e "${GREEN}=== AWS S3 + CloudFront Setup ===${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it using: brew install awscli"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating S3 bucket...${NC}"
aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION" \
    --acl private

echo -e "${GREEN}✓ Bucket created: $BUCKET_NAME${NC}"

echo -e "${YELLOW}Step 2: Blocking public access...${NC}"
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo -e "${GREEN}✓ Public access blocked${NC}"

echo -e "${YELLOW}Step 3: Creating CloudFront Origin Access Identity...${NC}"
OAI_OUTPUT=$(aws cloudfront create-cloud-front-origin-access-identity \
    --cloud-front-origin-access-identity-config \
    CallerReference="dating-app-$(date +%s)",Comment="Dating App OAI")

OAI_ID=$(echo "$OAI_OUTPUT" | grep -o '"Id": "[^"]*' | grep -o '[^"]*$' | head -1)
OAI_CANONICAL_USER=$(echo "$OAI_OUTPUT" | grep -o '"S3CanonicalUserId": "[^"]*' | grep -o '[^"]*$')

echo -e "${GREEN}✓ OAI created: $OAI_ID${NC}"

echo -e "${YELLOW}Step 4: Creating bucket policy...${NC}"
cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontOAI",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity $OAI_ID"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json

echo -e "${GREEN}✓ Bucket policy applied${NC}"

echo -e "${YELLOW}Step 5: Creating CloudFront distribution...${NC}"
cat > /tmp/cloudfront-config.json <<EOF
{
    "CallerReference": "dating-app-$(date +%s)",
    "Comment": "$CLOUDFRONT_COMMENT",
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/$OAI_ID"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "Compress": true,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        }
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "PriceClass": "PriceClass_100",
    "ViewerCertificate": {
        "CloudFrontDefaultCertificate": true
    }
}
EOF

CF_OUTPUT=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cloudfront-config.json)

CF_ID=$(echo "$CF_OUTPUT" | grep -o '"Id": "[^"]*' | grep -o '[^"]*$' | head -1)
CF_DOMAIN=$(echo "$CF_OUTPUT" | grep -o '"DomainName": "[^"]*' | grep -o '[^"]*$' | head -1)

echo -e "${GREEN}✓ CloudFront distribution created${NC}"

# Save configuration
cat > deploy/aws-config.env <<EOF
# AWS Deployment Configuration
# Generated on $(date)

BUCKET_NAME=$BUCKET_NAME
REGION=$REGION
OAI_ID=$OAI_ID
CLOUDFRONT_ID=$CF_ID
CLOUDFRONT_DOMAIN=$CF_DOMAIN
EOF

echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo -e "Bucket Name:          ${YELLOW}$BUCKET_NAME${NC}"
echo -e "Region:               ${YELLOW}$REGION${NC}"
echo -e "CloudFront ID:        ${YELLOW}$CF_ID${NC}"
echo -e "CloudFront Domain:    ${YELLOW}$CF_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Note: CloudFront distribution is being deployed. This may take 15-20 minutes.${NC}"
echo -e "${YELLOW}Configuration saved to: deploy/aws-config.env${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Build your app: ${GREEN}cd client && npm run build${NC}"
echo -e "2. Deploy: ${GREEN}./deploy/deploy.sh${NC}"
echo ""

# Cleanup temp files
rm -f /tmp/bucket-policy.json /tmp/cloudfront-config.json
