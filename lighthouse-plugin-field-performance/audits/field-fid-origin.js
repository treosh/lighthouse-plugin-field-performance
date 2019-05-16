const FieldAudit = require('./field-audit')

class FieldFidOriginAudit extends FieldAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fid-origin',
      title: 'First Input Delay',
      description: 'First Input Delay shows how fast UI responded after the first interaction.',
      ...this.defaultMeta
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
    const json = await FieldAudit.getData(artifacts, context)
    const { originLoadingExperience } = json
    if (!originLoadingExperience) {
      return {
        ...json,
        explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${FieldFidOriginAudit.meta.title} data for this origin.`
      }
    }

    return FieldAudit.makeAuditProduct(context, {
      fieldMetric: originLoadingExperience.metrics.FIRST_INPUT_DELAY_MS,
      timeUnit: 'ms'
    })
  }
}

module.exports = FieldFidOriginAudit
