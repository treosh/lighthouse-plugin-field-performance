const { exec } = require('child_process')
const data = require('./mock/load-experiance')

// @todo mock getCruxData to return data for testing purposes

;(() => {
  // lighthouse has weird requirements for plugin resolution,
  // because of this, all source is stored in lighthouse-plugin-field-performance folder, so it's testable locally
  exec('npx lighthouse https://treo.sh --plugins=lighthouse-plugin-field-performance --view --chrome-flags="--headless" --output-path=./results/apple.html', (err, stdout, stderr) => {
    if (err) console.log(err)
    console.log(stdout)

    process.exit(0)
  })
})()

