const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class FieldAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get defaultMeta() {
    return {
      failureTitle: '',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  // @todo add typings
  static makeTableDistributions(distributions) {
    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: 'category', itemType: 'text', text: 'Category' },
      { key: 'distribution', itemType: 'text', text: 'Distribution' }
    ]

    /** @type {LH.Audit.Details.Table['items']} */
    const items = distributions.map(({ min, max, proportion }, index) => {
      const item = {}
      const normMin = (min / 1000).toFixed(1)
      const normMax = max ? (max / 1000).toFixed(1) : null

      if (min === 0) {
        item.category = `Fast (less than ${normMax}s)`
      } else if (max && min === distributions[index - 1].max) {
        item.category = `Average (from ${normMin}s to ${normMax}s)`
      } else {
        item.category = `Slow (longer than ${normMin}s)`
      }

      item.distribution = `${(proportion * 100).toFixed()} %`

      return item
    })

    return Audit.makeTableDetails(headings, items)
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<Object>|Promise<LH.Audit.Product>}
   */
  static async getData(artifacts, context) {
    const { URL, settings } = artifacts
    const { psiToken } = context.settings
    const strategy = settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
    const json = await getCruxData(URL.finalUrl, { strategy, psiToken })
    if (!json.loadingExperience || !json.loadingExperience.metrics) {
      return {
        score: null,
        notApplicable: true
      }
    }
    return json
  }

  /**
   * @param {LH.Audit.Context} context
   * @param {Object} options
   * @return {Promise<LH.Audit.Product>}
   */
  static makeAuditProduct(context, { fieldMetric, timeUnit = 'sec' }) {
    let displayValue
    const numericValue = fieldMetric.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)

    if (timeUnit === 'sec') {
      displayValue = `${(numericValue / 1000).toFixed(1)} s`
    } else {
      displayValue = `${numericValue} ms`
    }

    return {
      score,
      numericValue,
      displayValue,
      details: FieldAudit.makeTableDistributions(fieldMetric.distributions)
    }
  }
}

module.exports = FieldAudit
