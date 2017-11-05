import uuid from 'uuid'

import {ADD_TRIP_PATTERN, CONVERT_TO_FREQUENCY} from '../constants'

export default function copyModification (modification) {
  const _id = uuid.v4()
  const name = `${modification.name} (copy)`
  if (modification.type === ADD_TRIP_PATTERN) {
    return {
      ...modification,
      _id,
      name,
      timetables: copyTimetables(modification._id, _id, modification.timetables)
    }
  } else if (modification.type === CONVERT_TO_FREQUENCY) {
    return {
      ...modification,
      _id,
      name,
      entries: copyTimetables(modification._id, _id, modification.entries)
    }
  } else {
    return {
      ...modification,
      _id,
      name
    }
  }
}

function copyTimetables (oldModificationId, newModificationId, timetables) {
  const idPairs = {}
  const tts = timetables.map(tt => {
    const newId = uuid.v4()
    idPairs[tt.timetableId || tt.entryId] = newId
    return {
      ...tt,
      id: newId
    }
  })

  tts
    .filter(tt => tt.phaseFromTimetable && tt.phaseFromTimetable.length > 0)
    .filter(tt => tt.phaseFromTimetable.indexOf(oldModificationId) === 0)
    .forEach(tt => {
      const oldTimetableId = tt.phaseFromTimetable.split(':')[1]
      tt.phaseFromTimetable = `${newModificationId}:${idPairs[oldTimetableId]}`
    })

  return tts
}
