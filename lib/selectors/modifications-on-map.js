// @flow
import {createSelector} from 'reselect'

import {ADD_TRIP_PATTERN} from '../constants'

export default createSelector(
  (state) => state.scenario.modifications,
  (modifications) =>
    modifications.filter((m) => m.showOnMap && (m.feed || m.type === ADD_TRIP_PATTERN))
)
