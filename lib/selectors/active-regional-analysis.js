import {createSelector} from 'reselect'

import selectCurrentRegionalAnalysisId from './current-regional-analysis-id'
import selectRegionalAnalyses from './regional-analyses'

export default createSelector(
  selectRegionalAnalyses,
  selectCurrentRegionalAnalysisId,
  (analyses, id) => analyses.find((a) => a._id === id)
)
