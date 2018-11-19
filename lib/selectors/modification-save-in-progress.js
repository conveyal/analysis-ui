// @flow
import {createSelector} from 'reselect'
import get from 'lodash/get'

import selectActiveModificationId from './active-modification-id'

export default createSelector(
  selectActiveModificationId,
  state => get(state, 'network.fetches', []),
  (_id, fetches) =>
    fetches.find(f => f.type === `put ${_id}`) !== undefined
)
