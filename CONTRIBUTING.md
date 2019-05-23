# How to Contribute

First of all, thank you for your interest in `lighthouse-plugin-field-performance`!
We'd love to accept your patches and contributions!

## Development

1. Install dependencies

```bash
npm install
```

1. Run plugin

```bash
npm run test-run https://www.apple.com # test plugin with a real PSI API response
npm run mock-run # test UI with mock data
```

> Plugin docs: https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md

1. Tests and linters

Coding style is fully defined in [.prettierrc](./.prettierrc).
We use [JSDoc](http://usejsdoc.org/) with [TypeScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript) for linting and annotations.

```bash
npm test # run all linters && tests
npx tsc -p . # run typescript checks
npx ava test/index.js # run just AVA tests
npx ava test/index.js -u # update AVA snapshots
```
