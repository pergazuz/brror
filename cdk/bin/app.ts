#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatingAppStack } from '../lib/dating-app-stack';

const app = new cdk.App();

new DatingAppStack(app, 'DatingAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Dating App - S3 + CloudFront Static Website',
});

app.synth();
