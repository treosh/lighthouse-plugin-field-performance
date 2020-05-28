# How to Contribute

First of all, thank you for your interest in `lighthouse-plugin-field-performance`!
We'd love to accept your patches and contributions!

#### 1. Install dependencies

```bash
yarn install
```

#### 2. Run plugin

```bash
yarn install # install deps
yarn link # create a global link for lighthouse-plugin-field-performance
yarn link lighthouse-plugin-field-performance # add symlink to test the plugin locally

yarn mobile-run https://www.apple.com/ # test plugin with a real PSI API response
yarn desktop-run https://www.booking.com/

yarn mobile-run https://treo.sh/ # empty response
yarn desktop-run https://treo.sh/ # just origin
```

`lighthouse-plugin-field-performance` folder is made of symlinks for a simple local testing.

#### 3. Improve the plugin

Write your patch. Improve the plugin to help capture Field Performance.

Helpful links:

- [Plugin docs](https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights)
- [PSI API](https://developers.google.com/speed/docs/insights/v5/get-started)

#### 4. Tests and linters

Coding style is fully defined in [.prettierrc](./.prettierrc).
We use [JSDoc](http://usejsdoc.org/) with [TypeScript](https://github.com/Microsoft/TypeScript/wiki/JSDoc-support-in-JavaScript) for linting and annotations.

```bash
# https://github.com/GoogleChrome/lighthouse/issues/9050#issuecomment-495678706
yarn link && yarn link lighthouse-plugin-field-performance # install plugin locally

yarn test # run all linters && tests
yarn tsc -p . # run typescript checks
yarn ava test/index.js # run just AVA tests
yarn ava test/index.js -u # update AVA snapshots
```
