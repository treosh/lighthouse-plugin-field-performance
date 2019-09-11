# lighthouse-plugin-field-performance

Lighthouse plugin that displays the "field" performance of the page for real-world Chrome users over the last 30 days.
This plugin extends the Lighthouse report with the data from [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/).

Check [Live Example](https://googlechrome.github.io/lighthouse/viewer/?gist=a688f27b4a7c0561b6d7f9e2b70aa4bd) to see the Lighthouse report with the plugin.

<img align="center" width="956" src="https://user-images.githubusercontent.com/158189/59276751-34600300-8c5f-11e9-945b-75770a91d5de.png">

## Install

Requires `node.js 10+` and `Lighthouse 5+`.

`npm install lighthouse-plugin-field-performance`

## Usage

Use the plugin with [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse) or node.js.

### CLI

- Pass plugin to lighthouse `npx lighthouse https://www.apple.com/ --plugins=lighthouse-plugin-field-performance`
- Pass your [PageSpeed Insights token](https://developers.google.com/speed/docs/insights/v5/get-started) with a custom config `npx lighthouse https://www.apple.com/ --config-path=./config.js`

`config.js`

```js
module.exports = {
  extends: 'lighthouse:default',
  plugins: ['lighthouse-plugin-field-performance'],
  settings: {
    psiToken: 'YOUR_REAL_TOKEN'
  }
}
```

### Node.js

```js
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')

runLighthouse('https://www.apple.com', {
  plugins: ['lighthouse-plugin-field-performance']
}).then(result => {
  console.log(result)
})
```

## Credits

Sponsored by [Treo.sh - Page speed monitoring made easy](https://treo.sh).

[![](https://travis-ci.org/treosh/lighthouse-plugin-field-performance.png)](https://travis-ci.org/treosh/lighthouse-plugin-field-performance)
[![](https://img.shields.io/npm/v/lighthouse-plugin-field-performance.svg)](https://npmjs.org/package/lighthouse-plugin-field-performance)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
