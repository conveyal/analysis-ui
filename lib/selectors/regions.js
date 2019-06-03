import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

export default createSelector(
  (state = {}) => state.region.regions,
  (regions = []) => sortBy(regions, ['name'])
)
