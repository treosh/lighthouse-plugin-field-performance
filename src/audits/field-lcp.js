const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldLcpAudit extends Audit {
  static get meta() {
    return {
      id: 'field-lcp',
      title: 'Largest Contentful Paint (LCP)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldLcpAudit.meta.title)
      return createValueResult(le.metrics.LARGEST_CONTENTFUL_PAINT_MS, 'lcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
