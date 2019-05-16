const FieldAudit = require('./field-audit')

class FieldFcpOriginAudit extends FieldAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'field-fcp-origin',
      title: 'First Contentful Paint',
      description: 'First Contentful Paint marks the time at which the first text or image is painted.',
      ...FieldAudit.defaultMeta
    }
  }

  /**
   * @return {LH.Audit.ScoreOptions}
   */
  static get defaultOptions() {
    return {
      scorePODR: 1000,
      scoreMedian: 2500
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
          does not have sufficient real-world ${FieldFcpOriginAudit.meta.title} data for this origin.`
      }
    }

    return FieldAudit.makeAuditProduct(context, {
      fieldMetric: originLoadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS
    })
  }
}

module.exports = FieldFcpOriginAudit
