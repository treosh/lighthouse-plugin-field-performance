const { Audit } = require('lighthouse')
const { runPsi } = require('./run-psi')

// cache PSI requests

const requests = new Map()

/**
 * Cache results and parse crux data.
 *
 * @param {LH.Artifacts} artifacts
 * @param {LH.Audit.Context} context
 * @return {Promise<{ loadingExperience: LPFP.LoadingExperience, originLoadingExperience: LPFP.LoadingExperience }>}
 */

exports.getCruxData = async (artifacts, context) => {
  const { URL, settings } = artifacts
  // @ts-ignore
  const psiToken = context.settings.psiToken || null
  const strategy = settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
  const url = URL.finalUrl
  const key = url + strategy
  if (!requests.has(key)) {
    requests.set(key, runPsi({ url, strategy, psiToken }))
  }
  const json = await requests.get(key)
  if (json.error) throw new Error(JSON.stringify(json.error))
  return { loadingExperience: json.loadingExperience, originLoadingExperience: json.originLoadingExperience }
}

/**
 * Estimate value and create numeric results
 *
 * @param {LPFP.MetricValue} metricValue
 * @param {string} timeUnit
 * @param {LH.Audit.ScoreOptions} options
 * @return {LH.Audit.Product}
 */

exports.createValueResult = (metricValue, timeUnit, options) => {
  let displayValue
  const numericValue = metricValue.percentile
  const score = Audit.computeLogNormalScore(numericValue, options.scorePODR, options.scoreMedian)

  if (isMs(timeUnit)) {
    displayValue = `${10 * Math.round(numericValue / 10)} ms`
  } else {
    displayValue = `${(numericValue / 1000).toFixed(1)} s`
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
 * @return {LH.Audit.Product}
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
 * @return {LH.Audit.Product}
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
 * @param {LPFP.LoadingExperience} le
 * @return {boolean}
 */

exports.isResultsInField = le => {
  return !!le && Boolean(Object.values(le.metrics).length)
}

/**
 * @param {LPFP.MetricValue} metricValue
 * @param {string} timeUnit
 * @return {Object}
 */

function createDistributionsTable({ distributions }, timeUnit) {
  const headings = [
    { key: 'category', itemType: 'text', text: 'Category' },
    { key: 'distribution', itemType: 'text', text: 'Distribution' }
  ]

  const items = distributions.map(({ min, max, proportion }, index) => {
    const item = {}
    const normMin = isMs(timeUnit) ? min : (min / 1000).toFixed(1)
    const normMax = isMs(timeUnit) ? max : max ? (max / 1000).toFixed(1) : null

    if (min === 0) {
      item.category = `Fast (faster than ${normMax}${timeUnit})`
    } else if (max && min === distributions[index - 1].max) {
      item.category = `Average (from ${normMin}${timeUnit} to ${normMax}${timeUnit})`
    } else {
      item.category = `Slow (longer than ${normMin}${timeUnit})`
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
