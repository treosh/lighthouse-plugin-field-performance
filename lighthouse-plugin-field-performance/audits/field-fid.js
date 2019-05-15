const { Audit } = require('lighthouse')
const FieldAudit = require('./field-audit')

class FieldFidAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fid',
      title: 'First Input Delay',
      description: 'First Input Delay shows how fast UI responded after the first interaction.',
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
    const json = await FieldAudit.getData(artifacts, context)
    const { loadingExperience } = json
    if (!loadingExperience) {
      return {
        ...json,
        explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${FieldFidAudit.meta.title} data for this page.`
      }
    }
    const FID = loadingExperience.metrics.FIRST_INPUT_DELAY_MS

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
