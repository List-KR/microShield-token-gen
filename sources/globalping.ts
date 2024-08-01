import * as Got from 'got'

export type TContinent = 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA'

// eslint-disable-next-line @typescript-eslint/naming-convention
export function PostCode(TargetUrl: string, headers: Record<string, string>, Continent: TContinent) {
  const URLInstance = new URL(TargetUrl)
  return Got.got('https://api.globalping.io/v1/measurements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'microShield-token-gen (https://github.com/List-KR/microShield-token-gen)'
    },
    http2: true,
    https: {
      minVersion: 'TLSv1.3'
    },
    body: JSON.stringify({
      type: 'http',
      target: URLInstance.hostname,
      locations: [{
        continent: Continent
      }],
      measurementOptions: {
        HttpOptions: {
          request: {
            path: URLInstance.pathname,
            method: 'GET',
            headers
          }
        }
      }
    })
  }).json()
}