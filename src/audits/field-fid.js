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
      title: 'First Input Delay (URL)',
      description:
        'First Input Delay (FID) quantifies the experience users feel when trying to interact with unresponsive pages. A fast FID (75th percentile) helps ensure that the page is usable. [Learn more](https://web.dev/fid/)',
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
