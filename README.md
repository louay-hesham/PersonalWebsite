# https://louay-morsi.me

My personal website, which hosts my online resume. Built with Angular and Bootstrap 5, hosted on an S3 bucket.

Requires Node 22.22+, 24.15+ or 26+.

## Commands

- `npm install`: install dependencies
- `npm start`: dev server at http://localhost:4200
- `npm run build`: production build into `dist/`
- `npm test`: unit tests (Vitest)
- `npm run deploy`: build, then `cdk deploy --all` (the `PersonalWebsiteCert` and `PersonalWebsite` stacks), which uploads `dist/` to the site bucket

## Infrastructure (`infra/`)

An AWS CDK app (TypeScript) for the stack `PersonalWebsite` in `eu-west-1`. It manages the `louay-morsi.me` and `www.louay-morsi.me` S3 website buckets and their policies, the Route 53 hosted zone and the apex alias record, a CloudFront distribution (HTTPS only via redirect, HSTS, `www` redirect function) with an ACM certificate (separate `PersonalWebsiteCert` stack in `us-east-1`), and publishes `dist/` to the site bucket with a CDN invalidation. The resources were adopted with `cdk import`, so their properties must keep matching what is live.

- `cd infra && npm install` once
- `npm run build` (from the repo root) before `cdk synth` / `cdk diff`, since the deployment reads `dist/`
- Deploying needs write credentials; a read-only profile is enough for `cdk synth`
- CloudFront certificates must be in `us-east-1`, so that region has to be bootstrapped too (`npx cdk bootstrap aws://795547477565/us-east-1` in `infra/`)
- Deployment never deletes existing objects (`prune: false`), because `ssp_helper/` lives in the same bucket and belongs to another project
- The domain registration and the `ssp_helper` stack are not managed here
