const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldClsOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'field-cls-origin',
      title: 'Cumulative Layout Shift (CLS)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const ole = await getLoadingExperience(artifacts, context, false)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldClsOriginAudit.meta.title)
      return createValueResult(ole.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE, 'cls')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
