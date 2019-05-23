const { Audit } = require('lighthouse')
const {
  getCruxData,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField
} = require('../utils/audit-helpers')

class FieldFcpOriginAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fcp-origin',
      title: 'First Contentful Paint',
      description: 'First Contentful Paint marks the time at which the first text or image is painted.',
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
    try {
      const { originLoadingExperience: ole } = await getCruxData(artifacts, context)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldFcpOriginAudit.meta.title)
      return createValueResult(ole.metrics.FIRST_CONTENTFUL_PAINT_MS, 's', FieldFcpOriginAudit.defaultOptions)
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFcpOriginAudit
