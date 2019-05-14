const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class CruxFcpOriginAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fcp-origin',
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
    if (!json.originLoadingExperience || !json.originLoadingExperience.metrics) {
      return { score: null, notApplicable: true }
    }

    const numericValue = json.originLoadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${(numericValue / 1000).toFixed(1)} s`
    }
  }
}

module.exports = CruxFcpOriginAudit
