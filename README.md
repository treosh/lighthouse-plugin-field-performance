# lighthouse-plugin-field-performance

> Get CrUX data with Lighthouse CLI or node api.

Plugin extends Lighthouse report with data fetch from CrUX to represent real performance score computed with Lab and Field Data. 

<img align="center" src="https://user-images.githubusercontent.com/6231516/57811956-48a20480-7774-11e9-90d4-5a3470acc0e3.png" />

## Usage

- Install plugin `npm install lighthouse-plugin-field-performance`
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

## License

MIT © [Treo.sh](https://treo.sh)
