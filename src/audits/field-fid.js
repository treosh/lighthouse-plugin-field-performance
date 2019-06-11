const { Audit } = require('lighthouse')
const {
  getCruxData,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField
} = require('../utils/audit-helpers')

class FieldFidAudit extends Audit {
  /**
   * @return {Object}
   */
  static get meta() {
    return {
      id: 'field-fid',
      title: 'First Input Delay (URL)',
      description:
        'First Input Delay indicates how fast UI responded after the first interaction. The value represents the 95th percentile of the page traffic. [Learn More](https://developers.google.com/speed/docs/insights/v5/about#faq)',
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
      const { loadingExperience: le } = await getCruxData(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldFidAudit.meta.title)
      return createValueResult(le.metrics.FIRST_INPUT_DELAY_MS, 'ms', FieldFidAudit.defaultOptions)
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFidAudit
