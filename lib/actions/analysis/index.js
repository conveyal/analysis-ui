/**
 * @flow
 *
 * Redux actions related to Single Point Analysis requests.
 */

import lonlat from '@conveyal/lonlat'
import {fetchMultiple, FETCH_ERROR} from '@conveyal/woonerf/fetch'
import message from '@conveyal/woonerf/message'
import get from 'lodash/get'
import {createAction} from 'redux-actions'

import {
  ANALYSIS_URL,
  FETCH_TRAVEL_TIME_SURFACE,
  PROFILE_REQUEST_DEFAULTS,
  TRAVEL_TIME_PERCENTILES
} from '../../constants'
import * as select from '../../selectors'
import downloadGeoTIFF from '../../utils/download-geotiff'
import localStorage from '../../utils/local-storage'
import timeout from '../../utils/timeout'
import R5Version from '../../modules/r5-version'
import type {GetState, LonLat} from '../../types'

import {parseTimesData} from './parse-times-data'

export const clearComparisonProject = createAction('clear comparison project')
export const setActiveVariant = createAction('set active variant')

export const setComparisonProject = createAction('set comparison project')
export const setDestination = createAction('set destination')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction(
  'set isochrone fetch status'
)
export const setIsochroneLonLat = createAction('set isochrone lonlat', x =>
  lonlat(x)
)
export const setIsochroneResults = createAction('set isochrone results')
export const setScenarioApplicationErrors = createAction(
  'set scenario application errors'
)
export const setScenarioApplicationWarnings = createAction(
  'set scenario application warnings'
)
export const setServerError = createAction(FETCH_ERROR)
export const selectBookmark = createAction('select bookmark')

export const setTravelTimeSurface = createAction('set travel time surface')
export const setComparisonTravelTimeSurface = createAction(
  'set comparison travel time surface'
)

/**
 * Save the profile request parameters to local storage
 */
export const setEntireProfileRequest = createAction('set profile request')
export const setProfileRequest = createAction('update profile request')
export const setDisplayedProfileRequest = createAction('set displayed profile request')

const requestSettingsKey = 'profileRequestSettings'
const getStoredSettings = () => JSON.parse(localStorage.getItem(requestSettingsKey) || '{}')

export const storeProfileRequestSettings = (profileRequest: any) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const regionId = select.currentRegionId(state, {})
    const storedSettings = getStoredSettings()
    storedSettings[regionId] = profileRequest
    localStorage.setItem(requestSettingsKey, JSON.stringify(storedSettings))

    dispatch(setEntireProfileRequest(profileRequest))
  }

export const loadProfileRequestSettings = (regionId: string) => {
  const storedProfileRequestSettings = getStoredSettings()
  const profileRequestSettings = storedProfileRequestSettings[regionId]
  if (profileRequestSettings) {
    return [
      setEntireProfileRequest({
        ...PROFILE_REQUEST_DEFAULTS, // keep this in case we want to add new fields / change the defaults
        ...profileRequestSettings
      }),
      R5Version.actions.setCurrentR5Version(profileRequestSettings.workerVersion)
    ]
  } else {
    return [
      setEntireProfileRequest(PROFILE_REQUEST_DEFAULTS),
      R5Version.actions.setCurrentR5Version(R5Version.RECOMMENDED_R5_VERSION)
    ]
  }
}

const straightLineDistance = () =>
  /compareToStraightLineDistance=([0-9.]+)/.exec(window.search)

/**
 * Handle fetching and constructing the travel time surface and comparison
 * surface and dispatching updates along the way.
 */
export const fetchTravelTimeSurface = (asGeoTIFF?: boolean) =>
  (dispatch: Dispatch, getState: GetState) => {
    dispatch(setIsochroneFetchStatus(
      message('analysis.fetchStatus.PERFORMING_ANALYSIS')))

    const state = getState()
    const project = select.currentProject(state)
    const currentProjectId = select.currentProjectId(state)
    const comparisonInProgress = select.comparisonInProgress(state)
    const comparisonProject = select.comparisonProject(state)
    const workerVersion = R5Version.select.currentVersion(state, {})

    const profileRequest = {
      ...PROFILE_REQUEST_DEFAULTS,
      ...get(state, 'analysis.profileRequest', {}),
      workerVersion,
      percentiles: TRAVEL_TIME_PERCENTILES,
      projectId: currentProjectId
    }

    // Store the profile request settings for the user/region
    dispatch(storeProfileRequestSettings(profileRequest))

    let retryTimeSeconds = 1
    async function retry (response) {
      if (response.status === 202) {
        dispatch(setIsochroneFetchStatus(
          get(response, 'value.message', message('analysis.fetchStatus.INITIALIZING_CLUSTER'))
        ))
        await timeout(retryTimeSeconds * 1000)
        if (retryTimeSeconds < 20) retryTimeSeconds *= 2
        return true
      } else {
        return false
      }
    }

    const headers = {}
    if (asGeoTIFF === true) {
      headers.Accept = 'image/tiff'
    }

    const fetches = [{
      url: ANALYSIS_URL,
      options: {
        body: profileRequest,
        headers,
        method: 'post'
      },
      retry
    }]

    if (comparisonInProgress && !straightLineDistance()) {
      fetches.push({
        url: ANALYSIS_URL,
        options: {
          body: {
            ...profileRequest,
            projectId: state.analysis.comparisonProjectId, // override with comparison values
            variantIndex: state.analysis.comparisonVariant
          },
          headers,
          method: 'post'
        },
        retry
      })
    }

    return dispatch(fetchMultiple({
      type: FETCH_TRAVEL_TIME_SURFACE,
      fetches,
      next: asGeoTIFF === true
        ? handleGeoTIFF([
          `${get(project, 'name', '')}-${profileRequest.variantIndex}`,
          `${get(comparisonProject, 'name', '')}-${profileRequest.variantIndex}`
        ])
        : handleSurface(profileRequest)
    }))
  }

/**
 * Handle the response for a GeoTIFF request.
 */
const handleGeoTIFF = (names) => (responses) => {
  return Promise
    // Handle values when `Content-Type` !== `application/octet-stream`
    .all(responses.map((r, i) => r.value || r.arrayBuffer()))
    .then(values => {
      values.forEach((data, i) =>
        downloadGeoTIFF({
          data,
          filename: `analysis-geotiff-${names[i]}.geotiff`
        }))

      return setIsochroneFetchStatus(false)
    })
}

/**
 * Handle response for a travel time surface request.
 */
export const handleSurface = (profileRequest: any) => (error: any, responses: any) => {
  if (error) {
    if (error.value.scenarioApplicationWarnings){
      return [
        setScenarioApplicationWarnings(null),
        setTravelTimeSurface(null),
        setComparisonTravelTimeSurface(null),
        setIsochroneFetchStatus(false),
        // responses is just the single response when there was an error
        setScenarioApplicationErrors(Array.isArray(error.value.scenarioApplicationWarnings)
          ? error.value.scenarioApplicationWarnings
          : [error.value.scenarioApplicationWarnings])
      ]
    } else {
      const errorInfo = {
        value: {
          message: error.statusText,
          stackTrace: error.value.message
        }
      }
      return setServerError(errorInfo)
    }
  } else if (responses[0].status === 202) { // response timeout
    return setIsochroneFetchStatus(false)
  }

  try {
    const surface = responseToSurface(responses[0].value)
    const comparisonSurface = responses.length > 1
      ? responseToSurface(responses[1].value)
      : undefined

    let straightLineSurface = null
    if (straightLineDistance()) {
      const speedKmh = parseFloat(straightLineDistance()[1])
      straightLineSurface = createStraightLineDistanceTravelTimeSurface(
        surface,
        {lon: profileRequest.fromLon, lat: profileRequest.fromLat},
        speedKmh
      )
    }

    return [
      setScenarioApplicationErrors(null),
      setScenarioApplicationWarnings([
        ...surface.warnings,
        ...(comparisonSurface ? comparisonSurface.warnings : [])
      ]),
      setTravelTimeSurface(surface),
      setComparisonTravelTimeSurface(straightLineSurface || comparisonSurface),
      setIsochroneFetchStatus(false),
      // Attempt to keep the UI in sync if changes have been made
      setDisplayedProfileRequest(profileRequest)
    ]
  } catch (e) {
    console.error(e)
    throw e
  }
}

// exported for testing
export function responseToSurface (response: any): any {
  if (response[0] && response[0].title) {
    // this is a list of errors from the backend
    return {
      errors: response,
      warnings: []
    }
  }

  return parseTimesData(response)
}

/**
 * Create a straight-line-distance travel time surface. This is a hidden feature
 * to allow a particular client to demonstrate that straight-line distance _from
 * the origin_ is absurd when used to compute transit access. Yes, people
 * actually do this.
 */
function createStraightLineDistanceTravelTimeSurface (surface: any, origin: LonLat, speedKmh: number) {
  const array = new Uint8ClampedArray(surface.depth)

  return {
    ...surface,
    errors: [],
    warnings: [{
      title: `Comparison project is using straight line distance with speed ${speedKmh} km/h`,
      messages: []
    }],
    get (x, y) {
      const ll = lonlat.fromPixel({
        x: x + surface.west,
        y: y + surface.north
      }, surface.zoom)
      const distMeters = lonlat.toLeaflet(ll).distanceTo([origin.lat, origin.lon])
      const timeMinutes = (distMeters / 1000 / speedKmh * 60) | 0

      for (let i = 0; i < surface.depth; i++) {
        array[i] = timeMinutes
      }

      return array
    }
  }
}
