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
 * @param {Object} artifacts
 * @param {Object} context
 * @param {boolean} [isUrl]
 * @return {Promise<LoadingExperience>}
 */

exports.getLoadingExperience = async (artifacts, context, isUrl = true) => {
  const { URL, settings } = artifacts
  // @ts-ignore
  const psiToken = context.settings.psiToken || null
  const strategy = settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
  const prefix = isUrl ? 'url' : 'origin'
  const url = `${prefix}:${URL.finalUrl}`
  const key = url + strategy
  if (!requests.has(key)) {
    requests.set(key, runPsi({ url, strategy, psiToken }))
  }
  const json = await requests.get(key)
  if (json.error) throw new Error(JSON.stringify(json.error))
  return json.loadingExperience
}

/**
 * Estimate value and create numeric results
 *
 * @param {MetricValue} metricValue
 * @param {string} timeUnit
 * @param {Object} options
 * @return {Object}
 */

exports.createValueResult = (metricValue, timeUnit, options) => {
  let displayValue
  const numericValue = metricValue.percentile
  const score = Audit.computeLogNormalScore(numericValue, options.scorePODR, options.scoreMedian)

  if (isMs(timeUnit)) {
    displayValue = `${formatValue(numericValue, { isMs: true })} ms`
  } else {
    displayValue = `${formatValue(numericValue)} s`
  }

  return {
    score,
    numericValue,
    displayValue,
    details: createDistributionsTable(metricValue, timeUnit)
  }
}

/**
 * Create result when data does not exist.
 *
 * @param {string} title
 * @return {Object}
 */

exports.createNotApplicableResult = title => {
  return {
    score: null,
    notApplicable: true,
    explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${title} data for this page.`
  }
}

/**
 * Create error result.
 *
 * @param {Error} err
 * @return {Object}
 */

exports.createErrorResult = err => {
  console.log(err)
  return {
    score: null,
    errorMessage: err.toString()
  }
}

/**
 * Checks if loading experience exists in field
 *
 * @param {LoadingExperience} le
 * @return {boolean}
 */

exports.isResultsInField = le => {
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
    { key: 'distribution', itemType: 'text', text: 'Percent of traffic' }
  ]

  const items = distributions.map(({ min, max, proportion }, index) => {
    const item = {}
    const normMin = formatValue(min, { isMs: isMs(timeUnit) })
    const normMax = formatValue(max, { isMs: isMs(timeUnit) })

    if (min === 0) {
      item.category = `Fast (faster than ${normMax} ${timeUnit})`
    } else if (max && min === distributions[index - 1].max) {
      item.category = `Average (from ${normMin} ${timeUnit} to ${normMax} ${timeUnit})`
    } else {
      item.category = `Slow (longer than ${normMin} ${timeUnit})`
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
