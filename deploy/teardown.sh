#!/bin/bash

# AWS Teardown Script - Remove all AWS resources
# Usage: ./deploy/teardown.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}=== AWS Resource Teardown ===${NC}"
echo ""

# Load configuration
if [ ! -f "deploy/aws-config.env" ]; then
    echo -e "${RED}Error: aws-config.env not found${NC}"
    echo "No resources to clean up"
    exit 1
fi

source deploy/aws-config.env

echo -e "${YELLOW}This will delete:${NC}"
echo "- S3 Bucket: $BUCKET_NAME"
echo "- CloudFront Distribution: $CLOUDFRONT_ID"
echo "- Origin Access Identity: $OAI_ID"
echo ""
read -p "Are you sure? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo -e "${YELLOW}Step 1: Disabling CloudFront distribution...${NC}"
# Get current distribution config
aws cloudfront get-distribution-config \
    --id "$CLOUDFRONT_ID" \
    --output json > /tmp/cf-config.json

# Extract ETag
ETAG=$(cat /tmp/cf-config.json | grep -o '"ETag": "[^"]*' | grep -o '[^"]*$')

# Modify config to disable
cat /tmp/cf-config.json | \
    jq '.DistributionConfig.Enabled = false | .DistributionConfig' > /tmp/cf-config-disabled.json

# Update distribution
aws cloudfront update-distribution \
    --id "$CLOUDFRONT_ID" \
    --distribution-config file:///tmp/cf-config-disabled.json \
    --if-match "$ETAG" > /dev/null

echo -e "${GREEN}✓ Distribution disabled${NC}"
echo -e "${YELLOW}Waiting for distribution to be disabled (this may take 10-15 minutes)...${NC}"

# Wait for distribution to be disabled
while true; do
    STATUS=$(aws cloudfront get-distribution --id "$CLOUDFRONT_ID" --query 'Distribution.Status' --output text)
    if [ "$STATUS" == "Deployed" ]; then
        ENABLED=$(aws cloudfront get-distribution --id "$CLOUDFRONT_ID" --query 'Distribution.DistributionConfig.Enabled' --output text)
        if [ "$ENABLED" == "False" ]; then
            break
        fi
    fi
    echo -n "."
    sleep 30
done

echo ""
echo -e "${GREEN}✓ Distribution is disabled${NC}"

echo -e "${YELLOW}Step 2: Deleting CloudFront distribution...${NC}"
NEW_ETAG=$(aws cloudfront get-distribution --id "$CLOUDFRONT_ID" --query 'ETag' --output text)
aws cloudfront delete-distribution \
    --id "$CLOUDFRONT_ID" \
    --if-match "$NEW_ETAG"

echo -e "${GREEN}✓ Distribution deleted${NC}"

echo -e "${YELLOW}Step 3: Emptying S3 bucket...${NC}"
aws s3 rm "s3://$BUCKET_NAME" --recursive

echo -e "${GREEN}✓ Bucket emptied${NC}"

echo -e "${YELLOW}Step 4: Deleting S3 bucket...${NC}"
aws s3api delete-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION"

echo -e "${GREEN}✓ Bucket deleted${NC}"

echo -e "${YELLOW}Step 5: Deleting Origin Access Identity...${NC}"
OAI_ETAG=$(aws cloudfront get-cloud-front-origin-access-identity \
    --id "$OAI_ID" \
    --query 'ETag' \
    --output text)

aws cloudfront delete-cloud-front-origin-access-identity \
    --id "$OAI_ID" \
    --if-match "$OAI_ETAG"

echo -e "${GREEN}✓ OAI deleted${NC}"

# Remove config file
rm -f deploy/aws-config.env

echo ""
echo -e "${GREEN}=== Teardown Complete! ===${NC}"
echo ""
echo "All AWS resources have been removed."
echo ""

# Cleanup temp files
rm -f /tmp/cf-config.json /tmp/cf-config-disabled.json
