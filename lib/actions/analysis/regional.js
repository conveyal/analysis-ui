/** Actions for regional analysis */

import authenticatedFetch from '../../utils/authenticated-fetch'
import {createAction} from 'redux-actions'

export const setRegionalAnalyses = createAction('set regional analyses')

export const load = async (projectId) => {
  // TODO error handling
  // NB intentionally not using serverAction so that the spinner does not appear each time we poll
  let regionalAnalyses = await authenticatedFetch(`/api/project/${projectId}/regional`)
    .then(res => res.json())
  return setRegionalAnalyses(regionalAnalyses)
}
