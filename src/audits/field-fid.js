const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldFidAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fid',
      title: 'First Input Delay (FID)',
      description: '...',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldFidAudit.meta.title)
      return createValueResult(le.metrics.FIRST_INPUT_DELAY_MS, 'fid')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
