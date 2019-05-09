const { Audit } = require('lighthouse')
const { getCruxData } = require('../psi')

class CruxAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'crux',
      title: '',
      failureTitle: '',
      description: 'First Contentful Paint',
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
      score: 0.9
    }
  }
}

module.exports = CruxAudit
