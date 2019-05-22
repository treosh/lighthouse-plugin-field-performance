const { resolve } = require('path')

exports.stubPSI = data => {
  const resolved = resolve(__dirname, '../lighthouse-plugin-field-performance/psi.js')
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: {
      getCruxData: () => {
        return data
      }
    }
  }
}
