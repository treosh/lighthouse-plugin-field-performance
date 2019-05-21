# lighthouse-plugin-field-performance

> Get CrUX data with Lighthouse CLI or node api.

Plugin extends Lighthouse report with data fetch from CrUX to represent real performance score computed with Lab and Field Data. 

<img align="center" src="https://user-images.githubusercontent.com/6231516/57811956-48a20480-7774-11e9-90d4-5a3470acc0e3.png" />

## Install

`npm install lighthouse-plugin-field-performance`

## Usage

### CLI

- Pass plugin to lighthouse `npx lighthouse https://treo.sh --plugins=lighthouse-plugin-field-performance`
- Pass PSI token with config `npx lighthouse https://treo.sh --plugins=lighthouse-plugin-field-performance --config-path=./config.js`

`config.js`

```js
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    psiToken: '0123456789', // real PSI token
  },
};
```

### Code

```js
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')

;(async () => {
  try {
    await runLighthouse(
      'https://treo.sh',
      {
        plugins: ['lighthouse-plugin-field-performance'],
      },
    )
    process.exit(0)
  } catch (e) {
    process.exit(1)
  }
})()
```

## License

MIT © [Treo.sh](https://treo.sh)
