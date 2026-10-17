# https://louay-morsi.me

My personal website, which hosts my online resume. Built with Angular and Bootstrap 5, hosted on an S3 bucket.

Requires Node 22.22+, 24.15+ or 26+.

## Commands

- `npm install`: install dependencies
- `npm start`: dev server at http://localhost:4200
- `npm run build`: production build into `dist/`
- `npm test`: unit tests (Vitest)
- `npm run deploy`: build, then upload `dist/` to the `louay-morsi.me` S3 bucket (needs AWS credentials in the environment)
