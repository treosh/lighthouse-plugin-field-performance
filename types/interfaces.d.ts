declare module 'lighthouse'
declare module 'node-fetch'

declare namespace LPFP {
  interface LoadingExperience {
    id: string
    metrics: {
      FIRST_INPUT_DELAY_MS: MetricValue
      FIRST_CONTENTFUL_PAINT_MS: MetricValue
    }
    overall_category: string
    initial_url: string
  }

  interface MetricValue {
    percentile: number
    distributions: Array<{
      min: number
      max: number
      proportion: number
    }>
  }
}
