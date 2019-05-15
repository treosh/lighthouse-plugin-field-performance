const { exec } = require('child_process')
const data = require('./mock/load-experiance')

// @todo mock getCruxData to return data for testing purposes

;(() => {
  exec('npx lighthouse https://treo.sh --plugins=lighthouse-plugin-field-performance --view --chrome-flags="--headless" --output-path=./results/apple.html', {
    cwd: '../'
  }, (err, stdout, stderr) => {
    if (err) console.log(err)
    console.log(stdout)
  })
})()

