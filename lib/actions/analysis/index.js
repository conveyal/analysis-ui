import {createGrid} from 'browsochrones'
import lonlat from '@conveyal/lonlat'
import fetch, {fetchMultiple} from '@conveyal/woonerf/fetch'
import {crc32} from 'crc'
import {Map as LeafletMap} from 'leaflet'
import {createAction} from 'redux-actions'

import {lockUiWithError} from '../'
import {PERFORMING_ANALYSIS, INITIALIZING_CLUSTER, COMPUTING_ISOCHRONE, statusByPriority} from '../../constants/analysis-status'
import convertToR5Modification from '../../utils/convert-to-r5-modification'
import timeout from '../../utils/timeout'
import {serverAction} from '../network'

const ZOOM = 9
const RETRY_TIMEOUT_MILLSECONDS = 5000

export const clearIsochroneResults = createAction('clear isochrone results')
export const enterAnalysisMode = createAction('enter analysis mode')
export const exitAnalysisMode = createAction('exit analysis mode')
export const setActiveVariant = createAction('set active variant')
export const setComparisonInProgress = createAction('set comparison in progress')
export const setComparisonModifications = createAction('set comparison modifications')
export const setComparisonScenarioId = createAction('set comparison scenario')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneFetchStatusMessage = createAction('set isochrone fetch status message')
export const setIsochroneLonLat = createAction('set isochrone lonlat', (x) => lonlat(x))
export const setIsochroneResults = createAction('set isochrone results')
export const setProfileRequest = createAction('set profile request')
export const setScenarioApplicationErrors = createAction('show scenario application errors')
export const setScenarioApplicationWarnings = createAction('set scenario application warnings')
export const selectBookmark = createAction('select bookmark')

const setTravelTimeSurface = createAction('set travel time surface')
const setComparisonTravelTimeSurface = createAction('set comparison travel time surface')
const setIndicatorLocally = createAction('set current indicator')
const setDestinationGrid = createAction('set destination grid')

/** Sets the comparison scenario ID, and retrieves that scenario */
export const setComparisonScenario = ({ id, bundleId, variantIndex }) => [
  setComparisonScenarioId({ id, bundleId, variantIndex }),
  serverAction({
    url: `/api/scenario/${id}/modifications`,
    next: async (response) => {
      // return everything to avoid things getting out of sync if multiple requests are made;
      // UI state should always be coherent.
      return setComparisonModifications({
        id,
        bundleId,
        variantIndex,
        // Variant -1 indicates to just use the raw bundle
        modifications: variantIndex === -1 ? [] : (await response.json()).filter(m => m.variants[variantIndex])
      })
    }
  })
]

export const setCurrentIndicator = (projectId, indicator) => fetch({
  url: `/api/grid/${projectId}/${indicator}`,
  next: (err, res) => {
    if (err) {
      // Chrome 57 preserves headers when following redirects, in a departure from previous versions
      // this means the auth header from authenticatedFetch is passed to S3, which causes S3 to fail.
      // There is no way to get the URL of the redirect without following the redirect, it appears,
      // so we make the first fetch call which gets redirected to s3 and returns an error. We then use
      // the final URL of that response to make another request without the auth header.
      return fetch({
        url: res.url,
        headers: {
          Authorization: '' // overwrite default auth header
        },
        next: (error, res) => {
          if (error) return lockUiWithError({ error })
          else return [setIndicatorLocally(indicator), setDestinationGrid(createGrid(res))]
        }
      })
    } else {
      return [setIndicatorLocally(indicator), setDestinationGrid(createGrid(res.value))]
    }
  }
})

export const fetchTravelTimeSurface = ({ scenario, comparison, bounds, dispatch, next }) => [
  setIsochroneFetchStatus(true),
  doTravelTimeSurfaceFetch({ scenario, comparison, bounds, dispatch, next })
]

const doTravelTimeSurfaceFetch = async ({ scenario, comparison, bounds, dispatch, next }) => {
  const nw = LeafletMap.prototype.project([bounds.north, bounds.west], ZOOM)
  const se = LeafletMap.prototype.project([bounds.south, bounds.east], ZOOM)
  const projectedBounds = {
    zoom: 9,
    west: Math.round(nw.x),
    north: Math.round(nw.y),
    // round individually so that we closely preserve the bounds even if the width changes a bit due
    // to rounding error
    width: Math.round(se.x) - Math.round(nw.x),
    height: Math.round(se.y) - Math.round(nw.y)
  }

  const requests = []
  requests.push(buildRequest({...scenario, ...projectedBounds}))
  if (comparison) requests.push(buildRequest({...comparison, ...projectedBounds}))

  const statuses = requests.map(req => PERFORMING_ANALYSIS)

  const updateStatus = s => dispatch(setIsochroneFetchStatusMessage(s))

  const updateFetchStatus = (index, status) => {
    statuses[index] = status

    if (statuses.length === 0) updateStatus(statuses[0])
    else {
      const status0Priority = statusByPriority.findIndex(i => i === statuses[0])
      const status1Priority = statusByPriority.findIndex(i => i === statuses[1])

      if (status0Priority < status1Priority) updateStatus(statuses[0])
      else updateStatus(statuses[1])
    }
  }

  return fetchMultiple({
    fetches: requests.map((body, idx) => ({
      url: '/api/analysis/enqueue/single',
      options: {
        method: 'POST',
        body
      },
      retry: async res => {
        if (res.status === 202) {
          updateFetchStatus(idx, INITIALIZING_CLUSTER)
          await timeout(RETRY_TIMEOUT_MILLSECONDS)
          return true
        } else {
          return false // don't retry
        }
      }
    })),
    next: (error, responses) => {
      if (error) return lockUiWithError({ error })

      // since we do it for both responses at once we can call updateStatus directly, no need for
      // a call to updateFetchStatus
      updateStatus(COMPUTING_ISOCHRONE)
      const [scenarioSurface, comparisonSurface] = responses.map(i => responseToSurface(i.value))

      if (next) next()

      if (scenarioSurface.errors.length > 0 || comparisonSurface && comparisonSurface.errors.length > 0) {
        return [
          setScenarioApplicationErrors([
            ...scenarioSurface.errors,
            ...(comparisonSurface ? comparisonSurface.errors : [])
          ]),
          setScenarioApplicationWarnings(null),
          setTravelTimeSurface(null),
          setComparisonTravelTimeSurface(null),
          setIsochroneFetchStatus(false)
        ]
      } else {
        return [
          setScenarioApplicationErrors(null),
          setScenarioApplicationWarnings([
            ...scenarioSurface.warnings,
            ...(comparisonSurface ? comparisonSurface.warnings : [])
          ]),
          setTravelTimeSurface(scenarioSurface),
          setComparisonTravelTimeSurface(comparisonSurface),
          setIsochroneFetchStatus(false),
          // in case multiple requests are enqueued simultaneously, attempt to keep the UI in sync
          setIsochroneLonLat({ lat: scenario.profileRequest.fromLat, lon: scenario.profileRequest.fromLon })
        ]
      }
    }
  })
}

/** Build a request to the analyst backend */
function buildRequest ({ bundleId, scenarioId, variantIndex, modifications, workerVersion, profileRequest, zoom, north, west, width, height }) {
  // ensure scenario reapplication when edited
  const scenarioCrc = crc32(JSON.stringify(modifications))

  return {
    graphId: bundleId,
    workerVersion,
    zoom,
    west,
    north,
    width,
    height,
    request: {
      ...profileRequest,
      scenario: {
        id: `${scenarioId}-${variantIndex}-${scenarioCrc}`,
        modifications: modifications.map(convertToR5Modification)
      }
    },
    type: 'travel-time-surface'
  }
}

function responseToSurface (response) {
  if (response[0] && response[0].title) {
    // this is a list of errors from the backend
    return {
      errors: response,
      warnings: []
    }
  } else {
    const data = new Int32Array(response)
    // validate header and version
    if (intToString(data[0]) + intToString(data[1]) !== 'ACCESSGR') throw new Error('Invalid header in travel time surface')
    if (data[2] !== 0) throw new Error(`Unsupported version ${data[2]} of travel time surface`)
    const zoom = data[3]
    const west = data[4]
    const north = data[5]
    const width = data[6]
    const height = data[7]
    const nSamples = data[8]

    // de delta code data
    for (let y = 0, pixel = 9; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // pixels are delta coded individually
        for (let sample = 0, val = 0; sample < nSamples; sample++, pixel++) {
          data[pixel] = (val += data[pixel])
        }
      }
    }

    return {
      zoom,
      west,
      north,
      width,
      height,
      nSamples,
      errors: [], // no errors - we got a result
      // TODO how to pass warnings when we don't have a json object? I suppose we could do something
      // awful like appending the json to the binary file
      warnings: [],
      get (x, y) {
        // 9 is header size
        const index1d = (y * width + x) * nSamples + 9
        // de-delta-code, return running sum
        return data.slice(index1d, index1d + nSamples)
      }
    }
  }
}

/** convert a four-byte int to a four-char string */
function intToString (val) {
  return String.fromCharCode(val & 0xff) +
    String.fromCharCode((val >> 8) & 0xff) +
    String.fromCharCode((val >> 16) & 0xff) +
    String.fromCharCode((val >> 24) & 0xff)
}
