import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectCurrentRegion from './current-region'

export default createSelector(
  state => get(state, 'analysis.profileRequest'),
  selectCurrentRegion,
  (pr, region = {}) => {
    return {
      ...pr,
      bounds: pr.bounds || region.bounds
    }
  }
)
