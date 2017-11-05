// @flow
import {createSelector} from 'reselect'

import selectActiveModificationId from './active-modification-id'

export default createSelector(
  state => state.scenario && state.scenario.modifications,
  selectActiveModificationId,
  (modifications = [], modificationId) =>
    modifications.find((m) => m._id === modificationId)
)
