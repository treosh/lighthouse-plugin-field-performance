# lighthouse-plugin-crux

> Get CrUX data with Lighthouse CLI or node api.

## Usage

- Install plugin `npm install lighthouse-plugin-crux`
- Pass plugin to lighthouse `lighthouse https://example.com --plugins=lighthouse-plugin-crux`

## Development

```bash
# install deps & peer dependencie
npm i && npm i --no-save lighthouse

# lighthouse has weird requirements for plugin resolution,
# because of this, all source is stored in lighthouse-plugin-crux folder, so it's testable locally
npx lighthouse https://example.com --plugins=lighthouse-plugin-crux --view --chrome-flags="--headless" --output-path=./results/example.com.html
npx lighthouse https://www.apple.com --plugins=lighthouse-plugin-crux --view --chrome-flags="--headless" --output-path=./results/www.apple.com.html
```
