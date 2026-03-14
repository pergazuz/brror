#!/bin/bash

# CDK Destroy Script - Remove all AWS resources
# Usage: ./destroy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}=== AWS CDK Stack Destruction ===${NC}"
echo ""

# Check if we're in the cdk directory
if [ ! -f "cdk.json" ]; then
    echo -e "${YELLOW}Changing to cdk directory...${NC}"
    cd cdk
fi

echo -e "${YELLOW}This will permanently delete:${NC}"
echo "- S3 bucket and all files"
echo "- CloudFront distribution"
echo "- All associated resources"
echo ""
read -p "Are you sure? Type 'yes' to confirm: " -r
echo ""

if [[ ! $REPLY == "yes" ]]; then
    echo "Cancelled"
    exit 0
fi

echo -e "${YELLOW}Destroying CDK stack...${NC}"
cdk destroy --force

echo ""
echo -e "${GREEN}=== Stack Destroyed! ===${NC}"
echo ""
echo "All AWS resources have been removed."
echo ""
