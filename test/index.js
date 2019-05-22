const { serial } = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')
const { runLighthouse } = require('lighthouse/lighthouse-cli/run')
const { stubPSI } = require('../script/utils')
const loadExperienceInCrUX = require('./fixtures/load-experiance')
const loadExperienceNotInCrUX = require('./fixtures/load-experiance-not-in-crux')
const { audits: expectedAuditInField } = require('./fixtures/test-results-in-crux')
const { audits: expectedAuditsNotInField } = require('./fixtures/test-results-no-crux')

const lhOptions = {
  output: ['json'],
  outputPath: './results/test-results.json',
  chromeFlags: '--headless --enable-logging --no-sandbox',
  plugins: ['lighthouse-plugin-field-performance']
}

const getTestReults = () => {
  return JSON.parse(readFileSync(join(__dirname, '../results/test-results.json'), 'utf8'))
}

serial('Measure field perf for site in CruX', async t => {
  stubPSI(loadExperienceInCrUX)
  await runLighthouse('https://google.com/', lhOptions)
  const { audits } = getTestReults()
  t.deepEqual(audits['field-fcp'], expectedAuditInField['field-fcp'])
  t.deepEqual(audits['field-fid'], expectedAuditInField['field-fid'])
  t.deepEqual(audits['field-fcp-origin'], expectedAuditInField['field-fcp-origin'])
  t.deepEqual(audits['field-fid-origin'], expectedAuditInField['field-fid-origin'])
})

serial('Measure field perf for site site not in CruX', async t => {
  stubPSI(loadExperienceNotInCrUX)
  await runLighthouse('https://example.com', lhOptions)
  const { audits } = getTestReults()
  t.deepEqual(audits['field-fcp'], expectedAuditsNotInField['field-fcp'])
  t.deepEqual(audits['field-fid'], expectedAuditsNotInField['field-fid'])
  t.deepEqual(audits['field-fcp-origin'], expectedAuditsNotInField['field-fcp-origin'])
  t.deepEqual(audits['field-fid-origin'], expectedAuditsNotInField['field-fid-origin'])
})
