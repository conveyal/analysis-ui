import {createSelector} from 'reselect'

import selectModification from './modification'

export default createSelector(
  (state) => state.mapState,
  selectModification,
  (mapState, modification) => mapState && mapState.modificationId === modification.id
    ? mapState.extendFromEnd
    : true
)
