# How to Contribute

First of all, thank you for your interest in `lighthouse-plugin-field-performance`!
We'd love to accept your patches and contributions!

#### 1. Install dependencies

```bash
npm install
```

#### 2. Run plugin

```bash
npm run mobile-run https://www.apple.com/ # test plugin with a real PSI API response
npm run desktop-run https://www.google.com/
npm run mock-run # test UI with mock data
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
npm test # run all linters && tests
npx tsc -p . # run typescript checks
npm run ava # run just AVA tests
npm run ava -u # update AVA snapshots
```
