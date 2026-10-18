import * as cdk from 'aws-cdk-lib';
import { CertificateStack } from '../lib/certificate-stack';
import { ACCOUNT } from '../lib/constants';
import { WebsiteStack } from '../lib/website-stack';

const app = new cdk.App();

// CloudFront certificates must be issued in us-east-1.
const certificate = new CertificateStack(app, 'PersonalWebsiteCert', {
  env: { account: ACCOUNT, region: 'us-east-1' },
  crossRegionReferences: true,
});

new WebsiteStack(app, 'PersonalWebsite', {
  env: { account: ACCOUNT, region: 'eu-west-1' },
  crossRegionReferences: true,
  certificate: certificate.certificate,
});
