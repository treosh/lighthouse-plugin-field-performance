const { Audit } = require('lighthouse')
const FieldAudit = require('./field-audit')

class FieldFcpOriginAudit extends Audit {
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
    const json = await FieldAudit.getData(artifacts, context)
    const { originLoadingExperience } = json
    if (!originLoadingExperience) {
      return {
        ...json,
        explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${FieldFcpOriginAudit.meta.title} data for this origin.`
      }
    }
    const FCP = originLoadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS

    const numericValue = FCP.percentile
    const score = Audit.computeLogNormalScore(numericValue, context.options.scorePODR, context.options.scoreMedian)
    return {
      score,
      numericValue,
      displayValue: `${(numericValue / 1000).toFixed(1)} s`,
      details: FieldAudit.makeTableDistributions(FCP.distributions)
    }
  }
}

module.exports = FieldFcpOriginAudit
