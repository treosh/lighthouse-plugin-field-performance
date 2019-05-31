module.exports = {
  audits: [
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fcp.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fid.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fcp-origin.js' },
    { path: 'lighthouse-plugin-field-performance/src/audits/field-fid-origin.js' }
  ],
  groups: {
    page: {
      title: 'Page summary'
    },
    origin: {
      title: 'All pages summary served from this origin'
    }
  },
  category: {
    title: 'Field Performance',
    description:
      'These performance metrics show the performance of the page for real-world Chrome users over the last 30 days. Data is collected anonymously in the "field" and provided by Chrome UX Report. [Learn More](https://developers.google.com/web/tools/chrome-user-experience-report/)',
    auditRefs: [
      { id: 'field-fcp', weight: 1, group: 'page' },
      { id: 'field-fid', weight: 1, group: 'page' },
      { id: 'field-fcp-origin', weight: 0, group: 'origin' },
      { id: 'field-fid-origin', weight: 0, group: 'origin' }
    ]
  }
}
