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
