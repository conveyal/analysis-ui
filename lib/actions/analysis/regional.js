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

/** This one does not handle comparisons. This also does not add anything to the map */
export const loadRegionalAnalysisGrids = ({ id, percentile }) => [
  setActiveRegionalAnalyses({ id, percentile }),
  serverAction({
    url: `/api/regional/${id}/grid/${percentile}`,
    next: async (res) => setRegionalAnalysisGrids({ grid: createGrid(await res.arrayBuffer()) })
  })
]
