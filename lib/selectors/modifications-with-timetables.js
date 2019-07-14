import {createSelector} from 'reselect'

import selectModifications from './modifications'

export default createSelector(
  selectModifications,
  modifications =>
    modifications.filter(
      m =>
        (m.entries && m.entries.length > 0) ||
        (m.timetables && m.timetables.length > 0)
    )
)
