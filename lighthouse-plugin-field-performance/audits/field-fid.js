const { Audit } = require('lighthouse')
const {
  getCruxData,
  createNotApplicableResult,
  createValueResult,
  createErrorResult
} = require('../utils/audit-helpers')

class FieldFidAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fid',
      title: 'First Input Delay',
      description: 'First Input Delay shows how fast UI responded after the first interaction.',
      failureTitle: '',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      scorePODR: 50,
      scoreMedian: 250
    }
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    try {
      const { loadingExperience: le } = await getCruxData(artifacts, context)
      if (!le) return createNotApplicableResult(FieldFidAudit.meta.title)
      return createValueResult(le.metrics.FIRST_INPUT_DELAY_MS, 'ms', FieldFidAudit.defaultOptions)
    } catch (err) {
      return createErrorResult(err)
    }
  }
}

module.exports = FieldFidAudit
