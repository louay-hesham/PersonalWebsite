import * as cdk from 'aws-cdk-lib';
import { WebsiteStack } from '../lib/website-stack';

const app = new cdk.App();

new WebsiteStack(app, 'PersonalWebsite', {
  env: { account: '795547477565', region: 'eu-west-1' },
});
