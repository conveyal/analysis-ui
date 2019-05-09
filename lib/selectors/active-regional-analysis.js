import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectRegionalAnalyses from './regional-analyses'

export default createSelector(
  selectRegionalAnalyses,
  state => get(state, 'analysis.regional._id'),
  (analyses, id) => analyses.find(a => a._id === id)
)
