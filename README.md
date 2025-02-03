#### Bazar Studio (FKA Helix)

Bazar Studio is an atomic asset uploader for the permaweb. Atomic assets uploaded through Bazar Studio can be traded on the [Universal Content Marketplace (UCM)](https://github.com/permaweb/ao-ucm) protocol and have real-world rights enforced by the [Universal Data License (UDL)](https://udlicense.arweave.net/).

<a href="https://studio_bazar.arweave.net/">https://studio_bazar.arweave.net/</a>

###### Requirements

- Node.js 18+ and npm

###### Run local

```
npm install
```

```
npm run

  start:development
    NODE_ENV=development webpack serve --port 3001
  start:staging
    NODE_ENV=staging webpack serve --port 3001
  format
    eslint --fix . && npx prettier --write .
  test:verbose
    npm test -- --verbose
  test:coverage
    CI=true npm test -- --env=jsdom --coverage
  build:staging
    NODE_ENV=staging webpack
  build:production
    NODE_ENV=production webpack
  deploy:main
    npm run build:production && permaweb-deploy --ant-process VTY3FfVNgfjsAUY0JiOCSxlm5gpQ8t7dHjY8QKEO-YY
  deploy:staging
    npm run build:staging && permaweb-deploy --ant-process VTY3FfVNgfjsAUY0JiOCSxlm5gpQ8t7dHjY8QKEO-YY --undername staging
```
