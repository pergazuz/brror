#!/bin/bash

# CDK Deployment Script for macOS
# This script builds the client app and deploys using AWS CDK

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Dating App CDK Deployment ===${NC}"
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

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo -e "${RED}Error: AWS CDK is not installed${NC}"
    echo "Install it using: npm install -g aws-cdk"
    exit 1
fi

# Check if we're in the cdk directory
if [ ! -f "cdk.json" ]; then
    echo -e "${YELLOW}Changing to cdk directory...${NC}"
    cd cdk
fi

# Install CDK dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Step 1: Installing CDK dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ CDK dependencies installed${NC}"
else
    echo -e "${GREEN}✓ CDK dependencies already installed${NC}"
fi

# Build the client application
echo -e "${YELLOW}Step 2: Building client application...${NC}"
cd ../client

if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
fi

npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Client application built${NC}"

# Return to CDK directory
cd ../cdk

# Build CDK TypeScript
echo -e "${YELLOW}Step 3: Building CDK stack...${NC}"
npm run build
echo -e "${GREEN}✓ CDK stack built${NC}"

# Check if bootstrap is needed
echo -e "${YELLOW}Step 4: Checking CDK bootstrap status...${NC}"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || echo "us-east-1")

if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region "$REGION" &> /dev/null; then
    echo -e "${YELLOW}CDK not bootstrapped in this account/region${NC}"
    echo -e "${YELLOW}Bootstrapping CDK...${NC}"
    cdk bootstrap "aws://$ACCOUNT/$REGION"
    echo -e "${GREEN}✓ CDK bootstrapped${NC}"
else
    echo -e "${GREEN}✓ CDK already bootstrapped${NC}"
fi

# Show what will be deployed
echo ""
echo -e "${YELLOW}Step 5: Reviewing changes...${NC}"
cdk diff || true

echo ""
echo -e "${YELLOW}Step 6: Deploying stack...${NC}"
cdk deploy --require-approval never

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "${BLUE}Stack Outputs:${NC}"
aws cloudformation describe-stacks \
    --stack-name DatingAppStack \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table

echo ""
echo -e "${GREEN}Your app is now live!${NC}"
echo ""
