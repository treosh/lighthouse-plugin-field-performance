const { Audit } = require('lighthouse')
const {
  getCruxData,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField
} = require('../utils/audit-helpers')

class FieldFidOriginAudit extends Audit {
  /**
   * @return {Object}
   */
  static get meta() {
    return {
      id: 'field-fid-origin',
      title: 'First Input Delay',
      description:
        'First Input Delay indicates how fast UI responded after the first interaction. The value represents the 95th percentile of all origin traffic. [Learn More](https://developers.google.com/speed/docs/insights/v5/about#faq)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  /**
   * @return {Object}
   */
  static get defaultOptions() {
    return {
      scorePODR: 50,
      scoreMedian: 250
    }
  }

  /**
   * @param {Object} artifacts
   * @param {Object} context
   * @return {Promise<Object>}
   */
  static async audit(artifacts, context) {
    try {
      const { originLoadingExperience: ole } = await getCruxData(artifacts, context)
      if (!isResultsInField(ole)) return createNotApplicableResult(FieldFidOriginAudit.meta.title)
      return createValueResult(ole.metrics.FIRST_INPUT_DELAY_MS, 'ms', FieldFidOriginAudit.defaultOptions)
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFidOriginAudit
