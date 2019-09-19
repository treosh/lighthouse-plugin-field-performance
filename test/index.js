const { serial } = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')

const lhOptions = {
  output: ['json'],
  outputPath: './results/test-results.json',
  chromeFlags: '--headless --enable-logging --no-sandbox',
  onlyCategories: ['lighthouse-plugin-field-performance'],
  plugins: ['lighthouse-plugin-field-performance']
}

/** @param {string} resName */
const getTestResults = resName => {
  return JSON.parse(readFileSync(join(__dirname, '../results', resName), 'utf8'))
}

serial('Measure field perf for site in CruX', async t => {
  const resName = 'in-field.json'
  await runLighthouse('https://example.com/', { ...lhOptions, outputPath: `./results/${resName}` })
  // FIXME: don't snapshot numeric values
  const { audits, categories } = getTestResults(resName)
  t.snapshot(audits['field-fcp'])
  t.snapshot(audits['field-fid'])
  t.snapshot(audits['field-fcp-origin'])
  t.snapshot(audits['field-fid-origin'])
  t.snapshot(categories['lighthouse-plugin-field-performance'])
})

serial('Measure field perf for site site not in CruX', async t => {
  const resName = 'not-in-field.json'
  await runLighthouse('https://alekseykulikov.com/', { ...lhOptions, outputPath: `./results/${resName}` })

  const { audits, categories } = getTestResults(resName)
  t.snapshot(audits['field-fcp'])
  t.snapshot(audits['field-fid'])
  t.snapshot(audits['field-fcp-origin'])
  t.snapshot(audits['field-fid-origin'])
  t.snapshot(categories['lighthouse-plugin-field-performance'])
})
