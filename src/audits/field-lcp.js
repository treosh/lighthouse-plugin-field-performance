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
      title: 'Largest Contentful Paint (URL)',
      description: `Largest Contentful Paint (LCP) reports the render time of the largest content element that is visible within the viewport. A fast LCP (75th percentile) helps reassure the user that the page is useful. [Learn more](https://web.dev/lcp/)`,
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
