const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldFidOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fid-origin',
      title: 'First Input Delay (Origin)',
      description: `First Input Delay (FID) quantifies the experience users feel when trying to interact with unresponsive pages. The value is 75th percentile of the origin traffic. [Learn more about FID](https://web.dev/fid/)`,
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const ole = await getLoadingExperience(artifacts, context, false)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldFidOriginAudit.meta.title)
      return createValueResult(ole.metrics.FIRST_INPUT_DELAY_MS, 'fid')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
