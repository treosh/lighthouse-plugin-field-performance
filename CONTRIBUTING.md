- [How to Contribute](#how-to-contribute)
  * [Getting setup](#getting-setup)
  * [Code reviews](#code-reviews)
  * [Code Style](#code-style)
  * [Commit Messages](#commit-messages)
 

# How to Contribute

First of all, thank you for your interest in lighthouse-plugin-field-performance!
We'd love to accept your patches and contributions!

## Getting setup

## Development

1. Clone this repository

```bash
git clone https://github.com/treosh/lighthouse-plugin-field-performance && lighthouse-plugin-field-performance
```

2. Install dependencies

```bash
npm install
```

3. Run plugin

```bash
npm run test-run
```

> Plugin docs: https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Code Style

- Coding style is fully defined in [.prettierrc](https://github.com/treosh/lighthouse-plugin-field-performance/blob/master/.prettierrc)
-We use [JSDoc](http://usejsdoc.org/) with [TypeScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript). Annotations are encouraged for all contributions.

To run code linter, use:

```bash
npm run lint
```

## Commit Messages

Commit messages should follow the Semantic Commit Messages format:

```
label(namespace): title
```
- `fix` - bug fixes.
- `feat` - features.
- `docs` - changes to docs.
- `test` - changes to tests infrastructure.
- `style` - code style: spaces/alignment/wrapping etc.
- `chore` - build-related work, e.g. doclint changes / travis / appveyor.

Disclaimer: Based on [Puppeteer Contributing Guidelines](https://github.com/GoogleChrome/puppeteer/blob/v1.16.0/CONTRIBUTING.md).
