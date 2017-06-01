import uuid from 'uuid'

import {ADD_TRIP_PATTERN, CONVERT_TO_FREQUENCY} from '../constants'

export default function copyModification (modification) {
  const id = uuid.v4()
  const name = `${modification.name} (copy)`
  if (modification.type === ADD_TRIP_PATTERN) {
    return {
      ...modification,
      id,
      name,
      timetables: copyTimetables(modification.id, id, modification.timetables)
    }
  } else if (modification.type === CONVERT_TO_FREQUENCY) {
    return {
      ...modification,
      id,
      name,
      entries: copyTimetables(modification.id, id, modification.entries)
    }
  } else {
    return {
      ...modification,
      id,
      name
    }
  }
}

function copyTimetables (oldModificationId, newModificationId, timetables) {
  const idPairs = {}
  const tts = timetables.map((tt) => {
    const newId = uuid.v4()
    idPairs[tt.id] = newId
    return {
      ...tt,
      id: newId
    }
  })

  tts
    .filter((tt) => tt.phaseFromTimetable && tt.phaseFromTimetable.length > 0)
    .filter((tt) => tt.phaseFromTimetable.indexOf(oldModificationId) === 0)
    .forEach((tt) => {
      const oldTimetableId = tt.phaseFromTimetable.split(':')[1]
      tt.phaseFromTimetable = `${newModificationId}:${idPairs[oldTimetableId]}`
    })

  return tts
}
