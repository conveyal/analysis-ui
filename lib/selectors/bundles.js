// @flow
import {createSelector} from 'reselect'

import selectCurrentRegion from './current-region'

export default createSelector(
  selectCurrentRegion,
  (region) => region ? region.bundles : []
)
