const ReportScoring = require('lighthouse/lighthouse-core/scoring')
const scoreAllCategories = ReportScoring.scoreAllCategories

/**
 * Monkey-patch Lighthouse's ReportScoring to support Core Web Vitals logic.
 * https://github.com/GoogleChrome/lighthouse/blob/f3d0e3459d8fd15b055148dec0ae4e430df6495b/lighthouse-core/scoring.js
 *
 * Logic: a URL passes the Core Web Vitals assessment if all its metrics pass thresholds.
 * The algorithm picks the minimum score (not `averageMean` used in Lighthouse).
 *
 * Theory of constraints (https://en.wikipedia.org/wiki/Theory_of_constraints): a chain is no stronger than its weakest link.
 */

/** @typedef {Object<string, {score: number}>} ResultsByAuditId */
/** @typedef {{ score: ?number, auditRefs: { id: string, weight: number }[] }} CategoryResult */

/** @param {any} configCategories @param {ResultsByAuditId} resultsByAuditId */
ReportScoring.scoreAllCategories = function (configCategories, resultsByAuditId) {
  const result = scoreAllCategories(configCategories, resultsByAuditId)
  const fieldPluginCategory = /** @type {CategoryResult | null} */ (result['lighthouse-plugin-field-performance'])
  if (!fieldPluginCategory) return result
  fieldPluginCategory.score = getMinScore(fieldPluginCategory, resultsByAuditId)
  return result
}

/** @param {CategoryResult} fieldPluginCategoryResult @param {ResultsByAuditId} resultsByAuditId */
function getMinScore(fieldPluginCategoryResult, resultsByAuditId) {
  const activeAuditRefs = fieldPluginCategoryResult.auditRefs.filter((auditRef) => auditRef.weight !== 0)
  const scores = activeAuditRefs.map((auditRef) => resultsByAuditId[auditRef.id].score)
  return scores.length ? Math.min(...scores) : 0
}

module.exports = {
  audits: [
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fcp.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-lcp.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fid.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-cls.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fcp-origin.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-lcp-origin.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fid-origin.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-cls-origin.js' },
  ],
  groups: {
    page: {
      title: 'Page summary',
    },
    origin: {
      title: 'Origin summary',
    },
  },
  category: {
    title: 'Field Performance',
    description:
      'These metrics show the performance of the page over the past 30 days. Data is collected anonymously in for real-world Chrome users and provided by Chrome UX Report. [Learn More](https://developers.google.com/web/tools/chrome-user-experience-report/)',
    auditRefs: [
      // Now every metric is weighted equally, based on idea to pass all CWV.
      //
      // alternative weights (based on Lighthouse):
      // 15 (FCP)
      // 25 + 15 = 40 (SI + LCP)
      // 15 + 25 = 40 (TTI + TBT)
      // 5 (CLS)
      { id: 'field-fcp', weight: 0, group: 'page' },
      { id: 'field-lcp', weight: 1, group: 'page' },
      { id: 'field-fid', weight: 1, group: 'page' },
      { id: 'field-cls', weight: 1, group: 'page' },
      { id: 'field-fcp-origin', weight: 0, group: 'origin' },
      { id: 'field-lcp-origin', weight: 0, group: 'origin' },
      { id: 'field-fid-origin', weight: 0, group: 'origin' },
      { id: 'field-cls-origin', weight: 0, group: 'origin' },
    ],
  },
}
