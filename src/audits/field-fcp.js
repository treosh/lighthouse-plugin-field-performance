const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldFcpAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fcp',
      title: 'First Contentful Paint (FCP)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldFcpAudit.meta.title)
      return createValueResult(le.metrics.FIRST_CONTENTFUL_PAINT_MS, 'fcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
