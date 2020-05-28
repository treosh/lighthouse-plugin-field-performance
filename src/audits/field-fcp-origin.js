const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldFcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'field-fcp-origin',
      title: 'First Contentful Paint (Origin)',
      description:
        'First Contentful Paint (FCP) marks the first time in the page load timeline where the user can see anything on the screen. The value is 75th percentile of the origin traffic. [Learn more about FCP](https://web.dev/fcp/)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const ole = await getLoadingExperience(artifacts, context, false)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldFcpOriginAudit.meta.title)
      return createValueResult(ole.metrics.FIRST_CONTENTFUL_PAINT_MS, 'fcp')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
