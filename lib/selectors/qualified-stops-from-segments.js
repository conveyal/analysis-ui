// @flow
import {createSelector} from 'reselect'

import selectStops from './stops-from-modification'

export default createSelector(selectStops, stops =>
  stops.filter(stop => !stop.autoCreated)
)
