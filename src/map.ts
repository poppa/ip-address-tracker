import { MapBoxAccessToken } from './constants'

export type LatLng = [number, number]

let map: L.Map
let marker: L.Marker
const defaultZoom = 13

export function initMap(latLng: LatLng): void {
  const L = window.L
  map = L.map('map', { zoomControl: false }).setView(latLng, defaultZoom)
  const icon = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 58]
  })
  marker = L.marker(latLng, { icon }).addTo(map)
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
  marker.setLatLng(latLng)
  // TODO: Calculate distance to new dest, and if not too far
  //       use map.flyTo()
  map.setView(latLng).setZoom(defaultZoom)
  // map.flyTo([lat, lng], defaultZoom)
}
