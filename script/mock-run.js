const { resolve } = require('path')
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')
const data = require('./mock/load-experiance')
const config = require('./mock/custom-config')

const stubPsi = data => {
  const resolved = resolve(__dirname, '../lighthouse-plugin-field-performance/psi.js')
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: {
      getCruxData: () => {
        return data
      }
    }
  }
}

;(async () => {
  try {
    stubPsi(data)
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
