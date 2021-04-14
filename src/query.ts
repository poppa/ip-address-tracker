const baseUri = 'https://json.geoiplookup.io/'

// Don't query the same URI twice
const cache = new Map<string, Ip>()

export async function query(ipOrDomain: string): Promise<Ip> {
  const uri = `${baseUri}${ipOrDomain}`

  if (cache.has(uri)) {
    return cache.get(uri)
  }

  const query = await fetch(uri)

  if (query.ok) {
    const res = (await query.json()) as Ip | IpError

    if (!res.success) {
      throw new Error(`${(res as IpError).error}`)
    }

    cache.set(uri, res)

    return res
  } else {
    console.error(`Bad response:`, query)
    throw new Error(`${query.status}: ${query.statusText || 'Bad response'}`)
  }
}

interface IpError {
  success: false
  error: string
}

interface Ip {
  ip: string
  isp: string
  org: string
  hostname: string
  latitude: number
  longitude: number
  postal_code: string
  city: string
  country_code: string
  country_name: string
  continent_code: string
  continent_name: string
  region: string
  district: string
  timezone_name: string
  connection_type: string
  asn_number: number
  asn_org: string
  asn: string
  currency_code: string
  currency_name: string
  success: true
  premium: boolean
}
