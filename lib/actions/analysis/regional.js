/** Actions for regional analysis */

import {createGrid} from 'browsochrones'
import {scales} from '@conveyal/gridualizer'
import fetch from '@conveyal/woonerf'
import { scalePow } from 'd3-scale'
import {createAction} from 'redux-actions'

import colors from '../../constants/colors'
import {serverAction} from '../network'
import authenticatedFetch from '../../utils/authenticated-fetch'

export const setRegionalAnalyses = createAction('set regional analyses')

export const load = async (projectId) => {
  // TODO error handling
  // NB intentionally not using serverAction so that the spinner does not appear each time we poll
  const regionalAnalyses = await authenticatedFetch(`/api/project/${projectId}/regional`)
    .then(res => res.json())
  return setRegionalAnalyses(regionalAnalyses)
}

export const setActiveRegionalAnalyses = createAction('set active regional analyses')
export const setRegionalAnalysisGrids = createAction('set regional analysis grids')
export const setMinimumImprovementProbability = createAction('set minimum improvement probability')
export const setRegionalAnalysisBounds = createAction('set regional analysis bounds')

/** This also does not add anything to the map */
export const loadRegionalAnalysisGrids = async ({ id, comparisonId, percentile, minimumImprovementProbability }) => {
  if (comparisonId) {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile, minimumImprovementProbability }),
      // TODO use serverAction below so we get spinner &c.
      Promise.all([
        authenticatedFetch(`/api/regional/${id}/grid/${percentile}/grid`).catch(res => res),
        authenticatedFetch(`/api/regional/${comparisonId}/grid/${percentile}/grid`).catch(res => res),
        // comparison query is the _base_, i.e. what is subtracted
        authenticatedFetch(`/api/regional/${comparisonId}/${id}/grid`).catch(res => res)
      ]
      // We redirect to S3, and due to a bug in Chrome 57, the auth header is forwarded and S3
      // chokes on that. So we make the request again without the auth header.
      // There's no way to get the URL of the redirect without following it due to browser security
      // restrictions.
      // Do this here so that each request is chained individually, otherwise the signed URLs can expire
      // while we are waiting for other responses.
      .map(req => req.then(res => window.fetch(res.url).then(res2 => res2.arrayBuffer()))))
      .then(([ gridRaw, comparisonGridRaw, probabilityGridRaw ]) => {
        const comparisonGrid = createGrid(comparisonGridRaw)
        const grid = createGrid(gridRaw)
        const probabilityGrid = createGrid(probabilityGridRaw)
        const differenceGrid = subtract(grid, comparisonGrid)
        const breaks = scales.diverging({ scheme: scales.quantile })(differenceGrid, colors.REGIONAL_COMPARISON_GRADIENT.length)
        return setRegionalAnalysisGrids({ grid, comparisonGrid, probabilityGrid, differenceGrid, breaks })
      })
    ]
  } else {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile }),
      authenticatedFetch(`/api/regional/${id}/grid/${percentile}/grid`)
        .catch(res => res)
        .then(res => window.fetch(res.url).then(res2 => res2.arrayBuffer()))
        .then(async (gridData) => {
          const grid = createGrid(gridData)
          const breaks = scales.equal({
            scale: scalePow().exponent(2).domain([grid.min, grid.max]).clamp(true),
            noDataValue: 0
          })(grid, colors.REGIONAL_GRADIENT.length)
          return setRegionalAnalysisGrids({ grid, breaks })
        })
    ]
  }
}

export const runAnalysis = (analysis) => serverAction({
  url: `/api/regional`,
  options: {
    method: 'POST',
    body: JSON.stringify(analysis)
  }
})

const deleteRegionalAnalysisLocally = createAction('delete regional analysis')
export const deleteRegionalAnalysis = (analysisId) => [
  // run local delete first so it seems snappier. The worst that will happen is that a regional analysis
  // will pop back up in a few seconds when we refresh regional analyses
  deleteRegionalAnalysisLocally(analysisId),
  serverAction({
    url: `/api/regional/${analysisId}`,
    options: {
      method: 'DELETE'
    }
  })
]

/** non-destructively subtract grid B from grid A */
function subtract (a, b) {
  const gridsDoNotAlign = a.west !== b.west ||
    a.north !== b.north ||
    a.zoom !== b.zoom ||
    a.width !== b.width ||
    a.height !== b.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for subtraction')
  }

  const { north, west, zoom, width, height } = a

  const newGrid = {
    north,
    west,
    zoom,
    width,
    height,
    data: new Int32Array(width * height),
    min: Infinity,
    max: -Infinity
  }

  for (let pixel = 0; pixel < width * height; pixel++) {
    const val = a.data[pixel] - b.data[pixel]
    newGrid.min = Math.min(newGrid.min, val)
    newGrid.max = Math.max(newGrid.max, val)
    newGrid.data[pixel] = val
  }

  return newGrid
}

export function downloadGridFromS3 (url) {
  return fetch({
    url,
    next: (err, response) => {
      if (err) window.alert(err)
      else window.open(response.url)
    }
  })
}
