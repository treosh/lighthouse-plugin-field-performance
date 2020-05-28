# lighthouse-plugin-field-performance

> A Lighthouse plugin that displays the field performance of your page.
> It uses real-world data from Chrome UX Report and Core Web Vitals to estimate the score.

[An example report for github.com](https://googlechrome.github.io/lighthouse/viewer/?gist=d9072ab8ccb30622deab48e6d5ee229c):

<a href="https://googlechrome.github.io/lighthouse/viewer/?gist=d9072ab8ccb30622deab48e6d5ee229c">
  <img width="1087" alt="Lighthouse Field Performance Plugin" src="https://user-images.githubusercontent.com/158189/83190516-d3ad2d00-a132-11ea-9f4a-68ead5b6a1b9.png">
</a>

<br />
<br />

This plugin adds a field performance category with real-world data from [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/). It's exactly like [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/), but for your local run and with a field performance score.

The scoring algorithm uses [Core Web Vitals](https://web.dev/vitals/). It weigths values for Largest Contentful Paint, First Input Delay, and Cumulative Layout Shift. (_Note_: FCP and the origin values do not affect the score, [see the source](./src/index.js))

Check out the parity between Field & Lab performance on mobile:

<img width="974" alt="Field & lab performance on mobile" src="https://user-images.githubusercontent.com/158189/65246644-4a4b5280-daef-11e9-9b1d-9158297a1f89.png">

And on desktop:

<img width="974" alt="Field & lab performance on desktop" src="https://user-images.githubusercontent.com/158189/65246645-4a4b5280-daef-11e9-92aa-e3495aebfa4b.png">

Sometimes field data is missing because a URL doesn't have enough anonymous traffic. In this case, the lab data is the only available measurement.

## Install

Requires Node.js `10+` and Lighthouse `6+`.

```bash
$ npm install lighthouse lighthouse-plugin-field-performance
```

## Usage

Use the plugin with [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse):

```bash
$ npx lighthouse https://www.apple.com/ --plugins=lighthouse-plugin-field-performance
```

Provide your [PageSpeed Insights token](https://developers.google.com/speed/docs/insights/v5/get-started) to run more requests (in production) with a custom config:

```bash
$ npx lighthouse https://www.apple.com/ --config-path=./config.js
```

`config.js`

```js
module.exports = {
  extends: 'lighthouse:default',
  plugins: ['lighthouse-plugin-field-performance'],
  settings: {
    psiToken: 'YOUR_REAL_TOKEN',
  },
}
```

## Credits

Sponsored by [Treo.sh - Page speed monitoring made simple](https://treo.sh).

[![](https://github.com/treosh/lighthouse-plugin-field-performance/workflows/CI/badge.svg)](https://github.com/treosh/lighthouse-plugin-field-performance/actions?workflow=CI)
[![](https://img.shields.io/npm/v/lighthouse-plugin-field-performance.svg)](https://npmjs.org/package/lighthouse-plugin-field-performance)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
