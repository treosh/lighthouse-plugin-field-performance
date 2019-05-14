const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class CruxFidOriginAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fid-origin',
      title: 'First Input Delay',
      description: 'First Input Delay',
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
      scorePODR: 50,
      scoreMedian: 250
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

    const numericValue = json.originLoadingExperience.metrics.FIRST_INPUT_DELAY_MS.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${numericValue} ms`
    }
  }
}

module.exports = CruxFidOriginAudit
