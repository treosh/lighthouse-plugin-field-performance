const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')
const FieldAudit = require('./field-audit')

class FieldFidAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fid',
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
    if (!json.loadingExperience || !json.loadingExperience.metrics) {
      return { score: null, notApplicable: true }
    }
    const FID = json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS

    const numericValue = FID.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${numericValue} ms`,
      details: FieldAudit.makeTableDistributions(FID.distributions)
    }
  }
}

module.exports = FieldFidAudit
