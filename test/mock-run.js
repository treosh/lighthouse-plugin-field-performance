const { runLighthouse } = require('lighthouse/lighthouse-cli/run')
const sinon = require('sinon')
const psi = require('../lighthouse-plugin-field-performance/utils/run-psi')
const data = require('./fixtures/load-experience.json')

const config = {
  extends: 'lighthouse:default'
  // settings: {
  //   psiToken: '0123456789'
  // }
}

;(async () => {
  try {
    sinon.stub(psi, 'runPsi').returns(Promise.resolve(data))
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
