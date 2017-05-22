import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  (state) => state.mapState,
  selectActiveModification,
  (mapState, modification) => mapState && mapState.modificationId === modification.id
    ? mapState.extendFromEnd
    : true
)
