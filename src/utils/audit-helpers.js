const { Audit } = require('lighthouse')
const simpleFormatNumber = require('simple-format-number')
const { runPsi } = require('./run-psi')

/**
 * @typedef {Object} LoadingExperience
 * @property {string} id
 * @property {{ FIRST_INPUT_DELAY_MS: MetricValue, FIRST_CONTENTFUL_PAINT_MS: MetricValue}} metrics
 * @property {string} overall_category
 * @property {string} initial_url
 *
 * @typedef {Object} MetricValue
 * @property {number} percentile
 * @property {{ min: number, max: number, proportion: number}[]} distributions
 */

// cache PSI requests

const requests = new Map()

/**
 * Cache results and parse crux data.
 *
 * @param {any} artifacts
 * @param {any} context
 * @param {boolean} [isUrl]
 * @return {Promise<LoadingExperience>}
 */

exports.getLoadingExperience = async (artifacts, context, isUrl = true) => {
  const psiToken = context.settings.psiToken || null
  const strategy = artifacts.settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
  const prefix = isUrl ? 'url' : 'origin'
  const { href, origin } = new URL(artifacts.URL.finalUrl)
  const url = `${prefix}:${href}`
  const key = url + strategy
  if (!requests.has(key)) {
    requests.set(key, runPsi({ url, strategy, psiToken }))
  }
  const json = await requests.get(key)
  if (json.error) throw new Error(JSON.stringify(json.error))
  // check, that URL response is not for origin
  if (isUrl) {
    const hasUrlExperience = json.loadingExperience && json.loadingExperience.id !== origin
    return hasUrlExperience ? json.loadingExperience : null
  }
  return json.loadingExperience
}

/**
 * Estimate value and create numeric results
 *
 * @param {MetricValue} metricValue
 * @param {string} timeUnit
 * @param {Metric} metric
 * @return {Object}
 */

exports.createValueResult = (metricValue, timeUnit, metric) => {
  let displayValue
  const numericValue = metricValue.percentile
  const range = getMetricRange(metric)
  const score = Audit.computeLogNormalScore(range, numericValue)

  if (isMs(timeUnit)) {
    displayValue = `${formatValue(numericValue, { isMs: true })} ms`
  } else {
    displayValue = `${formatValue(numericValue)} s`
  }

  return {
    score,
    numericValue,
    numericUnit: getMetricNumericUnit(metric),
    displayValue,
    details: createDistributionsTable(metricValue, timeUnit),
  }
}

/**
 * Create result when data does not exist.
 *
 * @param {string} title
 * @return {Object}
 */

exports.createNotApplicableResult = (title) => {
  return {
    score: null,
    notApplicable: true,
    explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${title} data for this page.`,
  }
}

/**
 * Create error result.
 *
 * @param {Error} err
 * @return {Object}
 */

exports.createErrorResult = (err) => {
  console.log(err)
  return {
    score: null,
    errorMessage: err.toString(),
  }
}

/**
 * Checks if loading experience exists in field
 *
 * @param {LoadingExperience} le
 * @return {boolean}
 */

exports.isResultsInField = (le) => {
  return !!le && Boolean(Object.values(le.metrics || {}).length)
}

/**
 * @param {MetricValue} metricValue
 * @param {string} timeUnit
 * @return {Object}
 */

function createDistributionsTable({ distributions }, timeUnit) {
  const headings = [
    { key: 'category', itemType: 'text', text: 'Category' },
    { key: 'distribution', itemType: 'text', text: 'Percent of traffic' },
  ]

  const items = distributions.map(({ min, max, proportion }, index) => {
    const item = {}
    const normMin = formatValue(min, { isMs: isMs(timeUnit) })
    const normMax = formatValue(max, { isMs: isMs(timeUnit) })

    if (min === 0) {
      item.category = `Good (faster than ${normMax} ${timeUnit})`
    } else if (max && min === distributions[index - 1].max) {
      item.category = `Needs improvement (from ${normMin} ${timeUnit} to ${normMax} ${timeUnit})`
    } else {
      item.category = `Poor (longer than ${normMin} ${timeUnit})`
    }

    item.distribution = `${(proportion * 100).toFixed()} %`

    return item
  })

  return Audit.makeTableDetails(headings, items)
}

/**
 * Check if `timeUnit` is in miliseconds
 *
 * @param {string} timeUnit
 * @return {boolean}
 */

function isMs(timeUnit) {
  return timeUnit === 'ms'
}

/**
 * Format `value` to a readable string.
 *
 * @param {number} value
 * @param {{ isMs?: boolean }} [opts]
 * @return {string}
 */

function formatValue(value, { isMs = false } = {}) {
  const val = isMs ? Math.round(value / 10) * 10 : parseFloat((value / 1000).toFixed(1))
  const digits = Math.round(val) === val || isMs ? 0 : 1
  return simpleFormatNumber(val, { fractionDigits: digits })
}

/**
 * Recommended ranks (https://web.dev/metrics/):
 *
 * FCP: Fast < 1 second,   Slow > 3s,    WEIGHT: 15%
 * LCP: Fast < 2.5 second, Slow > 4s,    WEIGHT: 35%
 * FID: Fast < 100 ms,     Slow > 300ms, WEIGHT: 30%
 * CLS: Fast < 0.1,        Slow > 0.25,  WEIGHT: 20%
 *
 * `p10` value is calibrated to return 0.9 for the fast value,
 * `median` value returns 0.5.
 *
 * The logic is taken from Lighthouse:
 * https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/largest-contentful-paint.js#L45
 *
 * @param {Metric} metric
 */

function getMetricRange(metric) {
  switch (metric) {
    case 'fcp':
      return { p10: 400 /* 1000 => 90 */, median: 3000 /* 3000 => 50 */ }
    case 'lcp':
      return { p10: 2250 /* 2500 => 90 */, median: 4000 /* 4000 => 50 */ }
    case 'fid':
      return { p10: 40 /* 100 => 90 */, median: 300 /* 300 => 50 */ }
    case 'cls':
      return { p10: 0.055 /* 0.1 => 90 */, median: 0.25 /* 0.25 => 50 */ }
    default:
      throw new Error(`Invalid metric range: ${metric}`)
  }
}

/** @param {Metric} metric */
function getMetricNumericUnit(metric) {
  return metric === 'cls' ? 'unitless' : 'millisecond'
}
