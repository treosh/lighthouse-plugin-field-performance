const { Audit } = require('lighthouse')
const FieldAudit = require('./field-audit')

class FieldFcpAudit extends FieldAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fcp',
      title: 'First Contentful Paint',
      description: 'First Contentful Paint marks the time at which the first text or image is painted.',
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
    const { loadingExperience } = json
    if (!loadingExperience) {
      return {
        ...json,
        explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${FieldFcpAudit.meta.title} data for this page.`
      }
    }
    const FCP = loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS

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

module.exports = FieldFcpAudit
