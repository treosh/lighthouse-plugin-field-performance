const { Audit } = require('lighthouse')
const FieldAudit = require('./field-audit')

class FieldFidOriginAudit extends Audit {
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
    const json = await FieldAudit.getData(artifacts, context)
    const { originLoadingExperience } = json
    if (!originLoadingExperience) {
      return {
        ...json,
        explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${FieldFidOriginAudit.meta.title} data for this origin.`
      }
    }
    const FID = originLoadingExperience.metrics.FIRST_INPUT_DELAY_MS

    const numericValue = originLoadingExperience.metrics.FIRST_INPUT_DELAY_MS.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${numericValue} ms`,
      details: FieldAudit.makeTableDistributions(FID.distributions)
    }
  }
}

module.exports = FieldFidOriginAudit
