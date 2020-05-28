declare module 'lighthouse'
declare module 'lighthouse/lighthouse-cli/run'
declare module 'node-fetch'

declare module 'simple-format-number' {
  function simplerFormatNumber(value: number, opts: { fractionDigits?: number }): string
  export = simplerFormatNumber
}
declare type Metric = 'fcp' | 'lcp' | 'fid' | 'cls'
