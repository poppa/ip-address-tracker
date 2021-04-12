const baseUri =
  'https://geo.ipify.org/api/v1?' +
  'apiKey=at_TrQTPleXJIxZp6JsheRZQDsCSrPIb&ipAddress=#'

const isDebug = true

console.log(`Is debug?`, isDebug)

export async function query(ipOrDomain: string): Promise<Ip | undefined> {
  const uri = isDebug ? '/sample.json' : baseUri.replace('#', ipOrDomain)
  const query = await fetch(uri)
  if (query.ok) {
    const res = (await query.json()) as Ip | Ip[]

    if (Array.isArray(res)) {
      const idx = Math.floor(Math.random() * res.length)
      console.log(`IDX:`, idx)
      return res[idx]
    }

    return res
  } else {
    console.error(`Bad response:`, query)
  }

  return undefined
}

interface Ip {
  ip: string
  location: Location
  domains: string[]
  as: As
  isp: string
  proxy: Proxy
}

interface Proxy {
  proxy: boolean
  vpn: boolean
  tor: boolean
}

interface As {
  asn: number
  name: string
  route: string
  domain: string
  type: string
}

interface Location {
  country: string
  region: string
  city: string
  lat: number
  lng: number
  postalCode: string
  timezone: string
  geonameId: number
}
