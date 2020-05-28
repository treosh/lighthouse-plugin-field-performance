const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

class FieldFcpAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fcp',
      title: 'First Contentful Paint (URL)',
      description:
        'First Contentful Paint marks the time at which the first text or image painted. The value represents the 75th percentile of the page traffic. [Learn More](https://developers.google.com/speed/docs/insights/v5/about#faq)',
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
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldFcpAudit.meta.title)
      return createValueResult(le.metrics.FIRST_CONTENTFUL_PAINT_MS, 's', 'fcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFcpAudit
