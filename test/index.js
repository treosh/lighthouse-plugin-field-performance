const { serial } = require('ava')
const { omit, isNumber, isString } = require('lodash')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const psiToken = process.env.PSI_TOKEN || ''

serial.only('Measure field perf for site in CruX', async (t) => {
  const { audits, categories } = await runLighthouse('https://example.com/')
  const category = categories['lighthouse-plugin-field-performance']
  checkResponse('field-fcp')
  checkResponse('field-lcp')
  checkResponse('field-fid')
  checkResponse('field-cls')
  checkResponse('field-fcp-origin')
  checkResponse('field-lcp-origin')
  checkResponse('field-fid-origin')
  checkResponse('field-cls-origin')

  console.log('field performance score: %s', category.score)
  t.snapshot(omit(category, ['score']))

  /** @param {string} auditName */
  function checkResponse(auditName) {
    const audit = audits[auditName]
    t.snapshot(omit(audit, ['details', 'displayValue', 'numericValue', 'score']), `check ${auditName}`)
    t.true(isNumber(audit.score) && audit.score >= 0 && audit.score <= 1)
    t.true(isNumber(audit.numericValue))
    t.true(isString(audit.displayValue))
    console.log('%s: %s/%s – %s', auditName, audit.numericValue, audit.displayValue, audit.score)
    t.snapshot(
      {
        ...audit.details,
        items: audit.details.items.map(/** @param {object} item */ (item) => omit(item, ['distribution'])),
      },
      `details ${auditName}`
    )
  }
})

serial('Measure field perf for site site not in CruX', async (t) => {
  const { audits, categories } = await runLighthouse('https://alekseykulikov.com/')
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

/** @param {string} url */
async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--enable-logging', '--no-sandbox'] })
  const flags = {
    port: chrome.port,
    onlyCategories: ['lighthouse-plugin-field-performance'],
  }
  const config = {
    extends: 'lighthouse:default',
    plugins: ['lighthouse-plugin-field-performance'],
    settings: psiToken ? { psiToken } : {},
  }
  const res = await lighthouse(url, flags, config)
  await chrome.kill()
  return res.lhr
}
