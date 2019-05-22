const { runLighthouse } = require('lighthouse/lighthouse-cli/run')
const data = require('../test/fixtures/load-experiance')
const config = require('./mock/custom-config')
const { stubPSI } = require('./utils')

;(async () => {
  try {
    stubPSI(data)
    await runLighthouse(
      'https://www.bbc.com/news',
      {
        output: ['html'],
        outputPath: './results/bbc.com.html',
        view: true,
        plugins: ['lighthouse-plugin-field-performance'],
        chromeFlags: '--headless'
      },
      config
    )
    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})()
