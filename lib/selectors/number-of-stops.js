import {createSelector} from 'reselect'

import selectStops from './stops-from-modification'

export default createSelector(
  selectStops,
  (stops) => stops.length
)
