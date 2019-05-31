const { Audit } = require('lighthouse')
const {
  getCruxData,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField
} = require('../utils/audit-helpers')

class FieldFcpAudit extends Audit {
  /**
   * @return {Object}
   */
  static get meta() {
    return {
      id: 'field-fcp',
      title: 'First Contentful Paint',
      description:
        'First Contentful Paint marks the time at which the first text or image painted. The value represents the 90th percentile of the page traffic. [Learn More](https://developers.google.com/speed/docs/insights/v5/about#faq)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  /**
   * @return {Object}
   */
  static get defaultOptions() {
    return {
      scorePODR: 1000,
      scoreMedian: 2500
    }
  }

  /**
   * @param {Object} artifacts
   * @param {Object} context
   * @return {Promise<Object>}
   */
  static async audit(artifacts, context) {
    try {
      const { loadingExperience: le } = await getCruxData(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldFcpAudit.meta.title)
      return createValueResult(le.metrics.FIRST_CONTENTFUL_PAINT_MS, 's', FieldFcpAudit.defaultOptions)
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFcpAudit
