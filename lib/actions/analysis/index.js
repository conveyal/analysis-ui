import lonlng from 'lonlng'
import {createAction} from 'redux-actions'

import {getIsochronesAndAccessibility} from '../../utils/browsochrones'

export const clearIsochroneResults = createAction('clear isochrone results')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneLatLng = createAction('set isochrone latlng', (x) => lonlng(x))
export const setIsochroneResults = createAction('set isochrone results')
export const setCurrentIndicator = createAction('set current indicator')
export const enterAnalysisMode = createAction('enter analysis mode')
export const exitAnalysisMode = createAction('exit analysis mode')
export const setActiveVariant = createAction('set active variant')

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
  next
}) => {
  return [
    setIsochroneFetchStatus(true),
    setIsochroneLatLng(origin),
    fetchIsochronesIncludingComparisonIfRequested({ scenarioId, comparisonScenarioId, projectId, bundleId, comparisonBundleId, modifications, comparisonModifications, isochroneCutoff, origin, indicator, workerVersion })
      .then(({ isochrone, comparisonIsochrone, grid, accessibility, comparisonAccessibility, indicator, isochroneCutoff, spectrogramData, comparisonSpectrogramData }) => [
        setIsochroneResults({ isochrone, comparisonIsochrone, grid, accessibility, comparisonAccessibility, indicator, isochroneCutoff, spectrogramData, comparisonSpectrogramData }),
        setIsochroneFetchStatus(false),
        // TODO there's got to be a more elegant way to call an action after isochrone results are updated
        next
      ])
  ]
}

async function fetchIsochronesIncludingComparisonIfRequested ({ scenarioId, comparisonScenarioId, projectId, bundleId, comparisonBundleId, modifications, comparisonModifications, isochroneCutoff, origin, indicator, workerVersion }) {
  const promises = []

  const isComparison = comparisonScenarioId != null

  // get the base query
  promises.push(getIsochronesAndAccessibility({
    scenarioId,
    projectId,
    bundleId,
    modifications,
    isochroneCutoff,
    origin,
    indicator,
    workerVersion
  }))

  // get the comparison query, if requested
  if (isComparison) {
    promises.push(getIsochronesAndAccessibility({
      scenarioId: comparisonScenarioId,
      projectId,
      bundleId: comparisonBundleId,
      modifications: comparisonModifications,
      isochroneCutoff,
      origin,
      indicator,
      workerVersion
    }))
  }

  const [result, comparison] = await Promise.all(promises)

  if (isComparison) {
    return {
      ...result,
      comparisonIsochrone: comparison.isochrone,
      comparisonAccessibility: comparison.accessibility,
      comparisonSpectrogramData: comparison.spectrogramData
    }
  } else {
    return result
  }
}
