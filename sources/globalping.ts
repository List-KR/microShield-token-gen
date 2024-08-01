import * as Got from 'got'

export type TContinent = 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA'
export type TRegion = 'Northern Africa' | 'Eastern Africa' | 'Middle Africa' | 'Southern Africa' | 'Western Africa' | 'Caribbean' | 'Central America' | 'South America' | 'Northern America' | 'Central Asia' | 'Eastern Asia' | 'South-eastern Asia' | 'Southern Asia' | 'Western Asia' | 'Eastern Europe' | 'Northern Europe' | 'Southern Europe' | 'Western Europe' | 'Australia and New Zealand' | 'Melanesia' | 'Micronesia' | 'Polynesia'

export async function PostCode(TargetUrl: string, Headers: Record<string, string>, Continent: TContinent) {
  const URLInstance = new URL(TargetUrl)
  const Result = await Got.got('https://api.globalping.io/v1/measurements', {
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
        request: {
          path: URLInstance.pathname,
          method: 'GET',
          headers: Headers
        }
      }
    })
  }).json()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return Result as { id: string, probesCount: number }
}

export async function GetResult(MeasurementId: string) {
  const Result = await Got.got(`https://api.globalping.io/v1/measurements/${MeasurementId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'microShield-token-gen (https://github.com/List-KR/microShield-token-gen)'
    },
    http2: true,
    https: {
      minVersion: 'TLSv1.3'
    }
  }).json()
  return Result as {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id: string
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type: 'http',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    target: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    status: 'in-progress' | 'finished',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    probesCount: number,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    results: Array<{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      probe: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        continent: TContinent,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        region: TRegion,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country: string
        // eslint-disable-next-line @typescript-eslint/naming-convention
        city: string
        // eslint-disable-next-line @typescript-eslint/naming-convention
        asn: number
        // eslint-disable-next-line @typescript-eslint/naming-convention
        network: string
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      result: Pick<{
        InProgressTestResult: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          status: 'in-progress'
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawOutput: string
        },
        FailedTestResult: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          status: 'failed'
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawOutput: string
        },
        OfflineTestResult: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          status: 'offline'
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawOutput: string
        },
        FinishedHttpTestResult: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          status: 'finished',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawOutput: string,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawHeaders: string,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rawBody: string | null,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: Record<string, string>,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          statusCode: number,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          statusCodeName: string
        }
      }, 'InProgressTestResult' | 'FailedTestResult' | 'OfflineTestResult' | 'FinishedHttpTestResult'>
    }>
  }
}