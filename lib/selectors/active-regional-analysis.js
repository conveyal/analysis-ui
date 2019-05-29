import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectRegionalAnalyses from './regional-analyses'

export default createSelector(
  selectRegionalAnalyses,
  state => get(state, 'queryString.analysisId'),
  (analyses, id) => analyses.find(a => a._id === id)
)
