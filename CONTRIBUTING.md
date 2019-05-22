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
npm run test-run https://www.apple.com # test plugin with the fetch of PSI API
npm run mock-run # test UI with moch data
```

> Plugin docs: https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Code Style

Coding style is fully defined in [.prettierrc](./.prettierrc).
We use [JSDoc](http://usejsdoc.org/) with [TypeScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript). Annotations are encouraged for all contributions.

To run code linter, use:

```bash
npm test
```
