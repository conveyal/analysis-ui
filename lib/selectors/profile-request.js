import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  (state) => get(state, 'analysis.requestsSettings[0'),
  (pr) => pr
)
