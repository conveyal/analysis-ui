// @flow
import {createSelector} from 'reselect'

import {ADD_TRIP_PATTERN} from '../constants'
import selectActiveModificationId from './active-modification-id'

export default createSelector(
  selectActiveModificationId,
  state => state.scenario.modifications,
  (activeModificationId, modifications = []) =>
    modifications.filter(m =>
      (m.id === activeModificationId || m.showOnMap) &&
      (m.feed || m.type === ADD_TRIP_PATTERN))
)
