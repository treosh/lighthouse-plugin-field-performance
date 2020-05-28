const { Audit } = require('lighthouse')
const {
  getLoadingExperience,
  createNotApplicableResult,
  createValueResult,
  createErrorResult,
  isResultsInField,
} = require('../utils/audit-helpers')

module.exports = class FieldClsAudit extends Audit {
  static get meta() {
    return {
      id: 'field-cls',
      title: 'Cumulative Layout Shift (URL)',
      description: `Cumulative Layout Shift (CLS) measures the sum of all individual layout shift scores for every unexpected layout shift that occurs during the entire lifespan of the page. A low CLS (75th percentile) helps ensure that the page is delightful. [Learn more](https://web.dev/cls/)`,
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    }
  }

  /** @param {Object} artifacts @param {Object} context */
  static async audit(artifacts, context) {
    try {
      const le = await getLoadingExperience(artifacts, context)
      if (!isResultsInField(le)) return createNotApplicableResult(FieldClsAudit.meta.title)
      return createValueResult(le.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE, 'cls')
    } catch (err) {
      return createErrorResult(err)
    }
  }
}
