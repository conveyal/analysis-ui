/** Actions for regional analysis */

import authenticatedFetch from '../../utils/authenticated-fetch'
import {serverAction} from '../network'
import {createAction} from 'redux-actions'
import {createGrid} from 'browsochrones'

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

/** This one does not handle comparisons. This also does not add anything to the map */
export const loadRegionalAnalysisGrids = async ({ id, comparisonId, percentile, minimumImprovementProbability }) => {
  if (comparisonId) {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile, minimumImprovementProbability }),
      // TODO use serverAction below so we get spinner &c.
      Promise.all([
        authenticatedFetch(`/api/regional/${id}/grid/${percentile}`).then(res => res.arrayBuffer()),
        authenticatedFetch(`/api/regional/${comparisonId}/grid/${percentile}`)
          .then(res => res.arrayBuffer()),
        // comparison query is the _base_, i.e. what is subtracted
        authenticatedFetch(`/api/regional/${comparisonId}/${id}/grid`).then(res => res.arrayBuffer())
      ]).then(([ baseGrid, comparisonGrid, probabilityGrid ]) =>
        setRegionalAnalysisGrids({
          grid: createGrid(baseGrid),
          comparisonGrid: createGrid(comparisonGrid),
          probabilityGrid: createGrid(probabilityGrid) }))
    ]
  } else {
    return [
      setActiveRegionalAnalyses({ id, comparisonId, percentile }),
      serverAction({
        url: `/api/regional/${id}/grid/${percentile}`,
        next: async (res) => setRegionalAnalysisGrids({ grid: createGrid(await res.arrayBuffer()) })
      })
    ]
  }
}
