import lonlng from 'lonlng'
import {createAction} from 'redux-actions'
import {serverAction} from '../network'

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
export const setComparisonScenarioId = createAction('set comparison scenario')
export const setComparisonModifications = createAction('set comparison modifications')
export const setDoingComparison = createAction('set doing comparison')

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
