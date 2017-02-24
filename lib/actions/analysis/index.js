import lonlat from '@conveyal/lonlat'
import {createAction} from 'redux-actions'

import {lockUiWithError} from '../'
import {serverAction} from '../network'
import {getIsochronesAndAccessibility, ScenarioApplicationError, AnalysisError, statusByPriority} from '../../utils/browsochrones'

export const clearIsochroneResults = createAction('clear isochrone results')
export const enterAnalysisMode = createAction('enter analysis mode')
export const exitAnalysisMode = createAction('exit analysis mode')
export const setActiveVariant = createAction('set active variant')
export const setComparisonInProgress = createAction('set comparison in progress')
export const setComparisonModifications = createAction('set comparison modifications')
export const setComparisonScenarioId = createAction('set comparison scenario')
export const setCurrentIndicator = createAction('set current indicator')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneFetchStatusMessage = createAction('set isochrone fetch status message')
export const setIsochroneLonLat = createAction('set isochrone lonlat', (x) => lonlat(x))
export const setIsochroneResults = createAction('set isochrone results')
export const setProfileRequest = createAction('set profile request')
export const showScenarioApplicationErrors = createAction('show scenario application errors')

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

export const fetchIsochrone = ({
  bundleId,
  projectId,
  indicator,
  isochroneCutoff,
  modifications,
  origin,
  scenarioId,
  comparisonBundleId,
  comparisonScenarioId,
  comparisonModifications,
  workerVersion,
  profileRequest,
  dispatch,
  next
}) => {
  return [
    setIsochroneFetchStatus(true),
    setIsochroneLonLat(origin),
    fetchIsochronesIncludingComparisonIfRequested({
      bundleId,
      comparisonBundleId,
      comparisonModifications,
      comparisonScenarioId,
      indicator,
      isochroneCutoff,
      modifications,
      origin,
      profileRequest,
      projectId,
      scenarioId,
      workerVersion,
      updateStatus: (status) => dispatch(setIsochroneFetchStatusMessage(status))
    })
      .then(({ isochrone, comparisonIsochrone, grid, accessibility, comparisonAccessibility, indicator, isochroneCutoff, spectrogramData, comparisonSpectrogramData, scenarioApplicationWarnings }) => [
        setIsochroneResults({ isochrone, comparisonIsochrone, grid, accessibility, comparisonAccessibility, indicator, isochroneCutoff, spectrogramData, comparisonSpectrogramData, scenarioApplicationWarnings }),
        setIsochroneFetchStatus(false),
        // TODO there's got to be a more elegant way to call an action after isochrone results are updated
        next
      ])
      // handle rejection; if it's a scenario application error display it
      .catch(err => {
        if (err instanceof ScenarioApplicationError) {
          return [
            setIsochroneFetchStatus(false),
            clearIsochroneResults(),
            showScenarioApplicationErrors(err.errors)
          ]
        } else if (err instanceof AnalysisError) {
          return lockUiWithError({ error: err.statusText, detailMessage: err.errorText })
        } else {
          // unexpected error, rethrow
          throw err
        }
      })
  ]
}

async function fetchIsochronesIncludingComparisonIfRequested ({
  bundleId,
  comparisonBundleId,
  comparisonModifications,
  comparisonScenarioId,
  indicator,
  isochroneCutoff,
  modifications,
  origin,
  profileRequest,
  projectId,
  scenarioId,
  workerVersion,
  updateStatus
}) {
  const promises = []

  const isComparison = comparisonScenarioId != null

  let status, comparisonStatus

  const handleStatusUpdate = () => {
    const statusPriority = statusByPriority.indexOf(status)
    const comparisonStatusPriority = statusByPriority.indexOf(comparisonStatus)
    const combinedStatus = statusPriority < comparisonStatusPriority
      ? status || comparisonStatus // if status is undefined, priority will be -1, fall through to comparison status
      : comparisonStatus || status
    updateStatus(combinedStatus)
  }

  // get the base query
  promises.push(getIsochronesAndAccessibility({
    bundleId,
    indicator,
    isochroneCutoff,
    modifications,
    origin,
    profileRequest,
    projectId,
    scenarioId,
    workerVersion,
    updateStatus: (newStatus) => {
      status = newStatus
      handleStatusUpdate()
    }
  }))

  // get the comparison query, if requested
  if (isComparison) {
    promises.push(getIsochronesAndAccessibility({
      bundleId: comparisonBundleId,
      indicator,
      isochroneCutoff,
      modifications: comparisonModifications,
      origin,
      profileRequest,
      projectId,
      scenarioId: comparisonScenarioId,
      workerVersion,
      updateStatus: (newStatus) => {
        comparisonStatus = newStatus
        handleStatusUpdate()
      }
    }))
  }

  let result, comparison
  try {
    [result, comparison] = await Promise.all(promises)
  } catch (e) {
    throw e // rethrow to caller
  }

  if (isComparison) {
    return {
      ...result,
      comparisonIsochrone: comparison.isochrone,
      comparisonAccessibility: comparison.accessibility,
      comparisonSpectrogramData: comparison.spectrogramData,
      scenarioApplicationWarnings: [
        ...(result.scenarioApplicationWarnings || []),
        ...(comparison.scenarioApplicationWarnings || [])
      ]
    }
  } else {
    return result
  }
}
