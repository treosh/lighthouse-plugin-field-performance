const { Audit } = require('lighthouse')

class FieldAudit extends Audit {
  static makeTableDistributions(distributions) {
    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: 'category', itemType: 'text', text: 'Category' },
      { key: 'distribution', itemType: 'text', text: 'Distribution' }
    ]

    /** @type {LH.Audit.Details.Table['items']} */
    const items = distributions
      .map(({ min, max, proportion }, index) => {
        const item = {}
        const normMin = (min / 1000).toFixed(1)
        const normMax = max ? (max / 1000).toFixed(1) : null

        if (min === 0) {
          item.category = `Fast (less than ${normMax}s)`
        } else if (max && min === distributions[index - 1].max) {
          item.category = `Average (from ${normMin}s to ${normMax}s)`
        } else {
          item.category = `Slow (longer than ${normMin}s)`
        }

        item.distribution = (proportion * 100).toFixed(1)

        return item
      })
      .sort(function(a, b) {
        return (b.distribution * 100).toFixed() - (a.distribution * 100).toFixed()
      })
      .map(item => {
        item.distribution = `${item.distribution} %`
        return item
      })

    return Audit.makeTableDetails(headings, items)
  }
}

module.exports = FieldAudit;
