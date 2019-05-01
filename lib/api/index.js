import fetch from '../utils/fetch'

const API_URL = process.env.API_URL

const BUNDLE_URL = `${API_URL}/bundle`
const MOD_URL = `${API_URL}/modification`
const OD_URL = `${API_URL}/opportunities`
const PROJECT_URL = `${API_URL}/project`
const REGION_URL = `${API_URL}/region`

// TODO Add Authorization: Bearer header
const getJSON = url => fetch(url).then(response => response.json())

export function getBundle(bundleId) {
  return getJSON(`${BUNDLE_URL}/${bundleId}`)
}

export function getBundles(regionId) {
  return getJSON(`${BUNDLE_URL}?regionId=${regionId}`)
}

export function getModification(modificationId) {
  return getJSON(`${MOD_URL}/${modificationId}`)
}

export function getModificationsForProject(projectId) {
  return getJSON(`${PROJECT_URL}/${projectId}/modifications`)
}

export function getOpportunitiesForRegion(regionId) {
  return getJSON(`${OD_URL}/region/${regionId}`)
}

export function getProject(projectId) {
  return getJSON(`${PROJECT_URL}/${projectId}`)
}

export function getProjects(regionId) {
  return getJSON(`${PROJECT_URL}?regionId=${regionId}`)
}

export function getRegion(regionId) {
  return getJSON(`${REGION_URL}/${regionId}`)
}
