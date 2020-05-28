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
      title: 'First Contentful Paint (URL)',
      description:
        'First Contentful Paint (FCP) marks the first time in the page load timeline where the user can see anything on the screen. A fast FCP (75th percentile) helps reassure the user that something is happening. [Learn more](https://web.dev/fcp/)',
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
