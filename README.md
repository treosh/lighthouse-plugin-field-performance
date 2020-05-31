# lighthouse-plugin-field-performance

> A Lighthouse plugin that displays the field performance of your page.
> It uses real-world data from Chrome UX Report and Core Web Vitals to estimate the score.

[An example report for developers.google.com](https://googlechrome.github.io/lighthouse/viewer/?gist=d9072ab8ccb30622deab48e6d5ee229c):

<a href="https://googlechrome.github.io/lighthouse/viewer/?gist=d9072ab8ccb30622deab48e6d5ee229c">
  <img width="1162" alt="Lighthouse Field Performance Plugin" src="https://user-images.githubusercontent.com/158189/83353335-27499180-a352-11ea-8ee5-059582117a14.png">
</a>

<br />
<br />

This plugin adds Core Web Vitals values to your Lighthouse report. The Field Performance category includes real-user data provided by [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/). It's similar to the field section in [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

The scoring algorithm weighs values for Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS) and picks a **minimum score**. It uses Core Web Vitals assessment that expects all its metrics to pass thresholds. For example, https://edition.cnn.com/ has LCP 5.9 s (15), FID 20 ms (100), and CLS 0.02 (100). It has `poor` mark in the [Search Console](https://support.google.com/webmasters/answer/9205520), and the score is 15. (_Note_: FCP and the origin values do not affect the score, [see the source](./src/index.js))

Check out the parity between Field & Lab performance on mobile:

<img width="973" alt="Field & lab performance on mobile" src="https://user-images.githubusercontent.com/158189/83353215-31b75b80-a351-11ea-801e-07f5a2b73e51.png">

And on desktop:

<img width="972" alt="Field & lab performance on desktop" src="https://user-images.githubusercontent.com/158189/83353212-2ebc6b00-a351-11ea-9cf8-6a04a5f0f903.png">

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
