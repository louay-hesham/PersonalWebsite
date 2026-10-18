import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

const DOMAIN = 'louay-morsi.me';

/**
 * Codifies the resources that already exist for louay-morsi.me. Every
 * resource here is meant to be adopted with `cdk import`, so properties must
 * match what is live today; do not "improve" them in the same change.
 *
 * The domain registration itself is not managed by CloudFormation.
 * ssp_helper/ lives in the site bucket but belongs to a separate project.
 * Run `ng build` first: the deployment reads ../dist.
 */
export class WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = this.websiteBucket('SiteBucket', DOMAIN, {
      websiteIndexDocument: 'index.html',
    });

    const wwwBucket = this.websiteBucket('WwwBucket', `www.${DOMAIN}`, {
      websiteRedirect: { hostName: DOMAIN },
    });

    const zone = new route53.HostedZone(this, 'Zone', { zoneName: DOMAIN });
    zone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    const apex = new route53.ARecord(this, 'ApexAlias', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(siteBucket)),
    });
    apex.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    // Publishes the built site (`ng build` output). prune is off on purpose:
    // the bucket also holds ssp_helper/ and older hashed files, which must survive.
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: siteBucket,
      prune: false,
    });

    void wwwBucket;
  }

  /** A public-read S3 static-website bucket, as created by hand in the console. */
  private websiteBucket(
    logicalId: string,
    bucketName: string,
    website: Pick<s3.BucketProps, 'websiteIndexDocument' | 'websiteRedirect' | 'websiteRoutingRules'>,
  ): s3.Bucket {
    const bucket = new s3.Bucket(this, logicalId, {
      bucketName,
      ...website,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'PublicReadGetObject',
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
    }));

    bucket.policy?.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    return bucket;
  }
}
