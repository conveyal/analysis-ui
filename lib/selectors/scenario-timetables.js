import {createSelector} from 'reselect'

import selectModificationsWithTimetables from './modifications-with-timetables'

export default createSelector(
  selectModificationsWithTimetables,
  (modifications) => modifications
    .reduce((timetables, modification) => [
      ...timetables,
      ...((modification.entries || modification.timetables)
        .filter(timetablesWithIds)
        .filter(timetablesThatAreNotExact)
        .map((timetable) => ({
          modificationId: modification.id,
          modificationName: modification.name,
          ...timetable
        })))
    ], [])
)

const timetablesWithIds = (tt) => !!tt.id
const timetablesThatAreNotExact = (tt) => !!tt.exactTimes
