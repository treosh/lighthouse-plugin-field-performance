const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldLcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'field-lcp-origin',
      title: 'Largest Contentful Paint (LCP)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const ole = await getLoadingExperience(artifacts, context, false)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldLcpOriginAudit.meta.title)
      return createValueResult(ole.metrics.LARGEST_CONTENTFUL_PAINT_MS, 'lcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
