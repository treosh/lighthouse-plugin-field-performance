module.exports = {
  // Additional audits to run on information Lighthouse gathered.
  audits: [{ path: 'lighthouse-plugin-crux/audits/crux.js' }],

  // A new category in the report for the plugin output.
  category: {
    title: 'Field Performance',
    description: 'Performance overview from Chrome users over the last 30 days.',
    auditRefs: [{ id: 'crux', weight: 1 }]
  }
}
