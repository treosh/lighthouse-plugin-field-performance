const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class CruxFcpOriginAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'crux-fid-origin',
      title: 'First Input Delay (Origin)',
      description: 'First Input Delay',
      failureTitle: '',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings']
    }
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts) {
    const { URL, settings } = artifacts
    const strategy = settings.emulatedFormFactor === 'desktop' ? 'desktop' : 'mobile'
    const json = await getCruxData(URL.finalUrl, strategy)
    console.log(json)
    return {
      score: 1
    }
  }
}

module.exports = CruxFcpOriginAudit
