const fetch = require('node-fetch')
const { stringify } = require('querystring')

// config

const runPagespeedUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const retryDelay = 3000
const maxRetries = 3

// expose

module.exports = { runPsi }

/**
 * Run PSI API.
 *
 * `url:` or `origin:` prefixes uses to get data quickly.
 * https://github.com/GoogleChrome/lighthouse/issues/1453#issuecomment-530163997
 * https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
 *
 * @param {{url: string, strategy: string, category?: string, psiToken?: string}} opts
 * @param {number} [retryCounter]
 * @return {Promise<Object>}
 */

async function runPsi(opts, retryCounter = 0) {
  const { url, category, strategy, psiToken } = opts
  const params = { url, strategy, ...(category ? { category } : {}), ...(psiToken ? { key: psiToken } : {}) }
  const strParams = stringify(params)
  const res = await fetch(runPagespeedUrl + '?' + strParams)
  if (res.status === 200) return res.json()

  const isJson = res.headers.get('content-type').includes('application/json')
  if (!isJson) {
    const text = await res.text()
    console.error('invalid PSI API response: status=%s text=%s', res.status, text)
    return retry()
  } else {
    const { error } = await res.json()
    console.error('invalid PSI API response: status=%s error=%j', res.status, error)
    if (error.code === 429) {
      console.log('error (%s): Too Many Requests', error.code)
      return retry()
    } else if (error.code === 400 || error.code === 500) {
      return { error }
    } else {
      throw new Error(`unknown response (${res.status}): ${error.message}`)
    }
  }

  /**
   * Retry PSI execution.
   *
   * @return {Promise<Object>}
   */

  async function retry() {
    if (retryCounter >= maxRetries) throw new Error(`maximum retries reached: ${retryCounter}`)
    console.log('wait %sms and retry', retryDelay)
    await new Promise((resolve) => setTimeout(resolve, retryDelay))
    return runPsi(opts, retryCounter + 1)
  }
}
