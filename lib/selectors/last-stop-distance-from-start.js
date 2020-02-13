import {createSelector} from 'reselect'

import selectStops from './stops-from-modification'

export default createSelector(selectStops, stops =>
  stops.length > 0 ? stops.slice(-1)[0].distanceFromStart : 0
)
