import {createSelector} from 'reselect'

import selectModification from './modification'
import routeStops from './route-stops'

const selectTimetables = createSelector(
  selectModification,
  (modification) => modification.entries && modification.entries.length > 0
    ? modification.entries
        .filter((tt) => !!tt.phaseFromTimetable)
        .map((tt) => tt.phaseFromTimetable)
    : []
)

const selectModifications = createSelector(
  [selectTimetables, (state) => state.scenario.modificationsById],
  (phaseFromTimetables, modificationsById) =>
    phaseFromTimetables && phaseFromTimetables.length > 0
      ? phaseFromTimetables.reduce((_, pft) => {
        _[pft] = modificationsById[pft.split(':')[0]]
        return _
      }, {})
      : {}
)

export default createSelector(
  [selectModifications, (state) => state],
  (modifications, state) => {
    const stopsForTimetable = {}
    Object
      .keys(modifications)
      .forEach((key) => {
        const modification = modifications[key]
        const entry = modification.entries.find((e) => e.id === key.split(':')[1])
        stopsForTimetable[key] = routeStops(state, {
          modification: {
            ...modification,
            trips: entry.patternTrips
          }
        })
      })
    return stopsForTimetable
  }
)
