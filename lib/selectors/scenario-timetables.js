import {createSelector} from 'reselect'

import selectModificationsWithTimetables from './modifications-with-timetables'

export default createSelector(
  selectModificationsWithTimetables,
  modifications =>
    modifications.filter(modification => !modification.bidirectional).reduce(
      (timetables, modification) => [
        ...timetables,
        ...(modification.entries || modification.timetables)
          .filter(timetablesWithoutIds)
          .filter(timetablesThatAreExact)
          .map(timetable => ({
            modificationId: modification._id,
            modificationName: modification.name,
            ...timetable
          }))
      ],
      []
    )
)

const timetablesWithoutIds = tt => !!tt._id
const timetablesThatAreExact = tt => !tt.exactTimes
