module.exports = {
  audits: [
    { path: 'lighthouse-plugin-field-performance/audits/field-fcp.js' },
    { path: 'lighthouse-plugin-field-performance/audits/field-fid.js' },
    { path: 'lighthouse-plugin-field-performance/audits/field-fcp-origin.js' },
    { path: 'lighthouse-plugin-field-performance/audits/field-fid-origin.js' }
  ],
  groups: {
    page: {
      title: 'Page summary'
    },
    origin: {
      title: 'Origin summary'
    }
  },
  category: {
    title: 'Field Performance',
    description: 'Real Chrome users metrics over the last 30 days.',
    auditRefs: [
      { id: 'field-fcp', weight: 1, group: 'page' },
      { id: 'field-fid', weight: 1, group: 'page' },
      { id: 'field-fcp-origin', weight: 0, group: 'origin' },
      { id: 'field-fid-origin', weight: 0, group: 'origin' }
    ]
  }
}
