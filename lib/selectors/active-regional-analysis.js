import {createSelector} from 'reselect'

import selectRegionalAnalyses from './regional-analyses'

export default createSelector(
  [selectRegionalAnalyses, (state, props) => props.params.regionalAnalysisId],
  (analyses, id) => analyses.find(a => a._id === id)
)
