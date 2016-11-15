import lonlng from 'lonlng'
import {createAction} from 'redux-actions'

import {getIsochronesAndAccessibility} from '../../utils/browsochrones'
import {serverAction} from '../network'

export const clearIsochroneResults = createAction('clear isochrone results')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneLatLng = createAction('set isochrone latlng', (x) => lonlng(x))
export const setIsochroneResults = createAction('set isochrone results')
export const setCurrentIndicator = createAction('set current indicator')
export const enterAnalysisMode = createAction('enter analysis mode')
export const exitAnalysisMode = createAction('exit analysis mode')
export const setActiveVariant = createAction('set active variant')

export const fetchIsochrone = ({ scenarioId, bundleId, modifications, isochroneCutoff, origin, indicator, workerVersion }) => {
  return [
    setIsochroneFetchStatus(true),
    setIsochroneLatLng(origin),
    getIsochronesAndAccessibility({ scenarioId, bundleId, modifications, isochroneCutoff, origin, indicator, workerVersion })
      .then(({ isochrone, accessibility, indicator, isochroneCutoff, spectrogramData }) => [
        setIsochroneResults({ isochrone, accessibility, indicator, isochroneCutoff, spectrogramData }),
        setIsochroneFetchStatus(false)
      ])
  ]
}

// TODO move to regional
export const runAnalysis = (analysis) => serverAction({
  url: `/api/regional`,
  options: {
    method: 'POST',
    body: JSON.stringify(analysis)
  }
})
