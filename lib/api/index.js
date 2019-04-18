import fetch from '../utils/fetch'

const API_URL = process.env.API_URL
const REGION_URL = `${API_URL}/region`
const BUNDLE_URL = `${API_URL}/bundle`

export function getRegion(regionId) {
  return fetch(`${REGION_URL}/${regionId}`).then(response => response.json())
}

export function getBundles(regionId) {
  return fetch(`${BUNDLE_URL}?regionId=${regionId}`).then(response =>
    response.json()
  )
}
