const { serial } = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')
const { omit, isNumber, isString } = require('lodash')
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')

const lhOptions = {
  output: ['json'],
  outputPath: './results/test-results.json',
  chromeFlags: '--headless --enable-logging --no-sandbox',
  onlyCategories: ['lighthouse-plugin-field-performance'],
  plugins: ['lighthouse-plugin-field-performance'],
}

/** @param {string} resName */
const getTestResults = (resName) => {
  return JSON.parse(readFileSync(join(__dirname, '../results', resName), 'utf8'))
}

serial('Measure field perf for site in CruX', async (t) => {
  const resName = 'in-field.json'
  await runLighthouse('https://example.com/', { ...lhOptions, outputPath: `./results/${resName}` })

  const { audits, categories } = getTestResults(resName)
  checkResponse(audits['field-fcp'])
  checkResponse(audits['field-lcp'])
  checkResponse(audits['field-fid'])
  checkResponse(audits['field-cls'])
  checkResponse(audits['field-fcp-origin'])
  checkResponse(audits['field-lcp-origin'])
  checkResponse(audits['field-fid-origin'])
  checkResponse(audits['field-cls-origin'])
  t.snapshot(categories['lighthouse-plugin-field-performance'])

  /** @param {any} audit */
  function checkResponse(audit) {
    t.snapshot(omit(audit, ['details', 'displayValue', 'numericValue', 'score']))
    t.true(isNumber(audit.score) && audit.score >= 0 && audit.score <= 1)
    t.true(isNumber(audit.numericValue))
    t.true(isString(audit.displayValue))
    t.snapshot({
      ...audit.details,
      items: audit.details.items.map(/** @param {object} item */ (item) => omit(item, ['distribution'])),
    })
  }
})

serial('Measure field perf for site site not in CruX', async (t) => {
  const resName = 'not-in-field.json'
  await runLighthouse('https://alekseykulikov.com/', { ...lhOptions, outputPath: `./results/${resName}` })

  const { audits, categories } = getTestResults(resName)
  t.snapshot(audits['field-fcp'])
  t.snapshot(audits['field-lcp'])
  t.snapshot(audits['field-fid'])
  t.snapshot(audits['field-cls'])
  t.snapshot(audits['field-fcp-origin'])
  t.snapshot(audits['field-lcp-origin'])
  t.snapshot(audits['field-fid-origin'])
  t.snapshot(audits['field-cls-origin'])
  t.snapshot(categories['lighthouse-plugin-field-performance'])
})
