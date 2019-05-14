# lighthouse-plugin-field-performance

> Get CrUX data with Lighthouse CLI or node api.

## Usage

- Install plugin `npm install lighthouse-plugin-field-performance`
- Pass plugin to lighthouse `lighthouse https://example.com --plugins=lighthouse-plugin-field-performance`

## Development

Docs: https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md

```bash
npm i # install deps
npm test # check tests

# lighthouse has weird requirements for plugin resolution,
# because of this, all source is stored in lighthouse-plugin-field-performance folder, so it's testable locally
npx lighthouse https://example.com --plugins=lighthouse-plugin-field-performance --view --chrome-flags="--headless" --output-path=./results/example.html
npx lighthouse https://www.apple.com --plugins=lighthouse-plugin-field-performance --view --chrome-flags="--headless" --output-path=./results/apple.html
```
