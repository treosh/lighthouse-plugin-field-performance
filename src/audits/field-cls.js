const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldClsAudit extends Audit {
  static get meta() {
    return {
      id: 'field-cls',
      title: 'Cumulative Layout Shift (CLS)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldClsAudit.meta.title)
      return createValueResult(le.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE, 'cls')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
