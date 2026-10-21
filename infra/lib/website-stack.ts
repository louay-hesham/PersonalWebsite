import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { DOMAIN, WWW_DOMAIN } from './constants';

export interface WebsiteStackProps extends cdk.StackProps {
  /** us-east-1 certificate covering the apex and www names. */
  readonly certificate: acm.ICertificate;
}

/**
 * Viewer-request function for the CloudFront distribution. S3 is read through
 * the REST endpoint (OAC), which has no website behavior, so this recreates the
 * bits the site relies on: www -> apex redirect, directory index documents and
 * the trailing-slash redirect (ssp_helper/ is served this way).
 */
const VIEWER_REQUEST_FUNCTION = `
function queryString(querystring) {
  var parts = [];
  for (var key in querystring) {
    var entry = querystring[key];
    if (entry.multiValue) {
      entry.multiValue.forEach(function (item) { parts.push(key + '=' + item.value); });
    } else {
      parts.push(entry.value === '' ? key : key + '=' + entry.value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: location } } };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var qs = queryString(request.querystring);

  if (request.headers.host.value === '${WWW_DOMAIN}') {
    return redirect('https://${DOMAIN}' + uri + qs);
  }
  if (uri.charAt(uri.length - 1) === '/') {
    request.uri = uri + 'index.html';
  } else if (uri.lastIndexOf('.') < uri.lastIndexOf('/')) {
    return redirect(uri + '/' + qs);
  }
  return request;
}
`;

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
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const siteBucket = this.websiteBucket('SiteBucket', DOMAIN, {
      websiteIndexDocument: 'index.html',
    });

    const wwwBucket = this.websiteBucket('WwwBucket', `www.${DOMAIN}`, {
      websiteRedirect: { hostName: DOMAIN },
    });

    const zone = new route53.HostedZone(this, 'Zone', { zoneName: DOMAIN });
    zone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    const viewerRequest = new cloudfront.Function(this, 'ViewerRequest', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(VIEWER_REQUEST_FUNCTION),
    });

    const responseHeaders = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(365),
          includeSubdomains: true,
          preload: false,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
      },
    });

    // HTTP is never served: viewers are redirected to HTTPS before any content.
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: DOMAIN,
      domainNames: [DOMAIN, WWW_DOMAIN],
      certificate: props.certificate,
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: responseHeaders,
        functionAssociations: [{
          function: viewerRequest,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
    });

    // DNS points at CloudFront. ApexAlias is the pre-existing A record (imported
    // earlier, so its logical id must stay); the rest are new.
    const cloudFrontTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
    const apex = new route53.ARecord(this, 'ApexAlias', { zone, target: cloudFrontTarget });
    apex.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
    new route53.AaaaRecord(this, 'ApexAliasAaaa', { zone, target: cloudFrontTarget });
    new route53.ARecord(this, 'WwwAlias', { zone, recordName: 'www', target: cloudFrontTarget });
    new route53.AaaaRecord(this, 'WwwAliasAaaa', { zone, recordName: 'www', target: cloudFrontTarget });

    // Consumed by the SSPHelper stack (Fn.importValue) to invalidate /ssp_helper/*.
    new cdk.CfnOutput(this, 'DistributionIdOutput', {
      value: distribution.distributionId,
      exportName: 'PersonalWebsiteDistributionId',
    });
    new cdk.CfnOutput(this, 'DistributionDomainOutput', {
      value: distribution.distributionDomainName,
      exportName: 'PersonalWebsiteDistributionDomain',
    });

    // Publishes the built site (`ng build` output). prune is off on purpose:
    // the bucket also holds ssp_helper/ and older hashed files, which must survive.
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: siteBucket,
      prune: false,
      distribution,
      distributionPaths: ['/*'],
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
