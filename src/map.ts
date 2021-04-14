import { MapBoxAccessToken } from './constants'
import { getDevice } from './utils'

export type LatLng = [number, number]

let map: L.Map
let marker: L.Marker
const defaultZoom = 13

function getPanOffset(): number {
  const device = getDevice()
  return device === 'mobile' ? 120 : 0
}

export function initMap(latLng: LatLng): void {
  const L = window.L
  map = L.map('map', { zoomControl: false }).setView(latLng, defaultZoom)
  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}` +
      `?access_token=${MapBoxAccessToken}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap</a> contributors, Imagery © ' +
        '<a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: MapBoxAccessToken
    }
  ).addTo(map)
}

export function updateMap(latLng: LatLng) {
  if (!marker) {
    const icon = window.L.icon({
      iconUrl: '/images/icon-location.svg',
      iconSize: [46, 56],
      iconAnchor: [23, 58]
    })

    marker = window.L.marker(latLng, { icon }).addTo(map)
  }

  marker.setLatLng(latLng)
  // TODO: Calculate distance to new dest, and if not too far
  //       use map.flyTo()
  map.setView(latLng, defaultZoom)

  const offset = getPanOffset()

  if (offset) {
    let center = map.project(latLng)
    center = window.L.point(center.x, center.y - offset)
    map.panTo(map.unproject(center))
  }
}
