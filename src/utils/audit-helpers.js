const { round } = require('lodash')
const { Audit } = require('lighthouse')
const { runPsi } = require('./run-psi')

/**
 * @typedef {'fcp' | 'lcp' | 'fid' | 'cls'} Metric
 * @typedef {{ percentile: number, distributions: { min: number, max: number, proportion: number}[] }} MetricValue
 * @typedef {{ id: string, overall_category: string, initial_url: string
               metrics: { FIRST_INPUT_DELAY_MS: MetricValue, FIRST_CONTENTFUL_PAINT_MS: MetricValue, LARGEST_CONTENTFUL_PAINT_MS: MetricValue, CUMULATIVE_LAYOUT_SHIFT_SCORE: MetricValue } }} LoadingExperience
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
 * @param {Metric} metric
 * @return {Object}
 */

exports.createValueResult = (metricValue, metric) => {
  const numericValue = normalizeMetricValue(metric, metricValue.percentile)
  return {
    numericValue,
    score: Audit.computeLogNormalScore(getMetricRange(metric), numericValue),
    numericUnit: getMetricNumericUnit(metric),
    displayValue: formatMetric(metric, numericValue),
    details: createDistributionsTable(metricValue, metric),
  }
}

/**
 * Create result when data does not exist.
 *
 * @param {string} title
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
 */

exports.isResultsInField = (le) => {
  return !!le && Boolean(Object.values(le.metrics || {}).length)
}

/**
 * @param {MetricValue} metricValue
 * @param {Metric} metric
 */

function createDistributionsTable({ distributions }, metric) {
  const headings = [
    { key: 'category', itemType: 'text', text: 'Category' },
    { key: 'distribution', itemType: 'text', text: 'Percent of traffic' },
  ]
  const items = distributions.map(({ min, max, proportion }, index) => {
    const item = {}
    const normMin = formatMetric(metric, normalizeMetricValue(metric, min))
    const normMax = formatMetric(metric, normalizeMetricValue(metric, max))

    if (min === 0) {
      item.category = `Good (faster than ${normMax})`
    } else if (max && min === distributions[index - 1].max) {
      item.category = `Needs improvement (from ${normMin} to ${normMax})`
    } else {
      item.category = `Poor (longer than ${normMin})`
    }

    item.distribution = `${round(proportion * 100, 1)} %`

    return item
  })

  return Audit.makeTableDetails(headings, items)
}

/**
 * Recommended ranks (https://web.dev/metrics/):
 *
 * FCP: Fast < 1.0 s,   Slow > 3.0 s
 * LCP: Fast < 2.5 s,   Slow > 4.0 s
 * FID: Fast < 100 ms,  Slow > 300 ms
 * CLS: Fast < 0.10,    Slow > 0.25
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
      return { p10: 1000, median: 3000 }
    case 'lcp':
      return { p10: 2500, median: 4000 }
    case 'fid':
      return { p10: 100, median: 300 }
    case 'cls':
      return { p10: 0.1, median: 0.25 }
    default:
      throw new Error(`Invalid metric range: ${metric}`)
  }
}

/** @param {Metric} metric, @param {number} value */
function formatMetric(metric, value) {
  switch (metric) {
    case 'fcp':
    case 'lcp':
      return round(value / 1000, 1).toFixed(1) + ' s'
    case 'fid':
      return round(round(value / 10) * 10) + ' ms'
    case 'cls':
      return value === 0 ? '0' : value === 0.1 ? '0.10' : round(value, 3).toString()
    default:
      throw new Error(`Invalid metric format: ${metric}`)
  }
}

/** @param {Metric} metric @param {number} value */
function normalizeMetricValue(metric, value) {
  return metric === 'cls' ? value / 100 : value
}

/** @param {Metric} metric */
function getMetricNumericUnit(metric) {
  return metric === 'cls' ? 'unitless' : 'millisecond'
}
