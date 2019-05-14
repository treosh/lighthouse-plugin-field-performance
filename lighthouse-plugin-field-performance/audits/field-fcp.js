const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class CruxFcpAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fcp',
      title: 'First Contentful Paint',
      description: 'First Contentful Paint',
      failureTitle: '',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      scorePODR: 1000,
      scoreMedian: 2500
    }
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const { URL, settings } = artifacts
    const strategy = settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
    const json = await getCruxData(URL.finalUrl, strategy)
    if (!json.loadingExperience || !json.loadingExperience.metrics) {
      return { score: null, notApplicable: true }
    }
    const FCP = json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: 'proportion', itemType: 'text', text: 'Proportion' },
      { key: 'min', itemType: 'text', text: 'Min' },
      { key: 'max', itemType: 'text', text: 'Max' }
    ]

    /** @type {LH.Audit.Details.Table['items']} */
    const items = FCP.distributions.map(({ min, max, proportion }) => {
      return {
        min: `${(min / 1000).toFixed(1)} sec`,
        max: `${max ? (max / 1000).toFixed(1) : '60'} sec`,
        proportion: `${(proportion * 100).toFixed(1)} %`
      }
    })

    const numericValue = FCP.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${(numericValue / 1000).toFixed(1)} s`,
      details: Audit.makeTableDetails(headings, items)
    }
  }
}

module.exports = CruxFcpAudit
