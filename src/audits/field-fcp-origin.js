const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

class FieldFcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fcp-origin',
      title: 'First Contentful Paint (Origin)',
      description:
        'First Contentful Paint marks the time at which the first text or image painted. The value represents the 90th percentile of all origin traffic. [Learn More](https://developers.google.com/speed/docs/insights/v5/about#faq)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /**
   * @param {Object} artifacts
   * @param {Object} context
   * @return {Promise<Object>}
   */
  static async audit(artifacts, context) {
    try {
      const ole = await getLoadingExperience(artifacts, context, false)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldFcpOriginAudit.meta.title)
      return createValueResult(ole.metrics.FIRST_CONTENTFUL_PAINT_MS, 's', 'fcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFcpOriginAudit
