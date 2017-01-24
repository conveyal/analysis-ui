/** Actions for regional analysis */

import authenticatedFetch from '../../utils/authenticated-fetch'
import {serverAction} from '../network'
import {createAction} from 'redux-actions'
import {createGrid} from 'browsochrones'
import {Choropleth} from '@conveyal/gridualizer'
import colors from '../../constants/colors'

export const setRegionalAnalyses = createAction('set regional analyses')

export const load = async (projectId) => {
  // TODO error handling
  // NB intentionally not using serverAction so that the spinner does not appear each time we poll
  let regionalAnalyses = await authenticatedFetch(`/api/project/${projectId}/regional`)
    .then(res => res.json())
  return setRegionalAnalyses(regionalAnalyses)
}

export const setActiveRegionalAnalyses = createAction('set active regional analyses')
export const setRegionalAnalysisGrids = createAction('set regional analysis grids')
export const setMinimumImprovementProbability = createAction('set minimum improvement probability')

/** This also does not add anything to the map */
export const loadRegionalAnalysisGrids = async ({ id, comparisonId, percentile, minimumImprovementProbability }) => {
  if (comparisonId) {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile, minimumImprovementProbability }),
      // TODO use serverAction below so we get spinner &c.
      Promise.all([
        authenticatedFetch(`/api/regional/${id}/grid/${percentile}/grid`).then(res => res.arrayBuffer()),
        authenticatedFetch(`/api/regional/${comparisonId}/grid/${percentile}/grid`)
          .then(res => res.arrayBuffer()),
        // comparison query is the _base_, i.e. what is subtracted
        authenticatedFetch(`/api/regional/${comparisonId}/${id}/grid`).then(res => res.arrayBuffer())
      ]).then(([ gridRaw, comparisonGridRaw, probabilityGridRaw ]) => {
        const comparisonGrid = createGrid(comparisonGridRaw)
        const grid = createGrid(gridRaw)
        const probabilityGrid = createGrid(probabilityGridRaw)
        const differenceGrid = subtract(grid, comparisonGrid)
        const breaks = Choropleth.quantileDiverging({ noDataValue: 0 })(differenceGrid, colors.REGIONAL_COMPARISON_GRADIENT.length)
        return setRegionalAnalysisGrids({ grid, comparisonGrid, probabilityGrid, differenceGrid, breaks })
      })
    ]
  } else {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile }),
      serverAction({
        url: `/api/regional/${id}/grid/${percentile}/grid`,
        next: async (res) => {
          const grid = createGrid(await res.arrayBuffer())
          const breaks = Choropleth.quantile({ noDataValue: 0 })(grid, colors.REGIONAL_GRADIENT.length)
          return setRegionalAnalysisGrids({ grid, breaks })
        }
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
