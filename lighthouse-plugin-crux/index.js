module.exports = {
  audits: [
    { path: 'lighthouse-plugin-crux/audits/crux-fcp.js' },
    { path: 'lighthouse-plugin-crux/audits/crux-fid.js' },
    { path: 'lighthouse-plugin-crux/audits/crux-fcp-origin.js' },
    { path: 'lighthouse-plugin-crux/audits/crux-fid-origin.js' }
  ],
  category: {
    title: 'Field Performance',
    description: 'Performance overview from Chrome users over the last 30 days.',
    auditRefs: [
      { id: 'crux-fcp', weight: 1 },
      { id: 'crux-fid', weight: 1 },
      { id: 'crux-fcp-origin', weight: 0 },
      { id: 'crux-fid-origin', weight: 0 }
    ]
  }
}
