import uuid from 'uuid'

import {ADD_TRIP_PATTERN, CONVERT_TO_FREQUENCY} from '../constants'

export default function copyModifications (
  modifications,
  newScenarioId,
  variants
) {
  const modificationIdPairs = new Map()
  const timetableIdPairs = new Map()

  /**
   * Create all the new modifications and new timetables while adding their new
   * IDs to Maps that allow you to loop through the modifications a second time
   * and correctly pair the newly created item's fields (ex: phaseFromTimetable)
   */
  const newModifications = modifications.map(modification => {
    const _id = uuid.v4()
    modificationIdPairs.set(modification._id, _id)
    const newVariants = []

    for (let i = 0; i < variants.length; i++) {
      if (i < modification.variants.length) {
        newVariants.push(modification.variants[i])
      } else {
        newVariants.push(false)
      }
    }

    if (modification.type === ADD_TRIP_PATTERN) {
      return {
        ...modification,
        _id,
        timetables: copyTimetables(modification.timetables, timetableIdPairs),
        scenario: newScenarioId,
        variants: newVariants
      }
    } else if (modification.type === CONVERT_TO_FREQUENCY) {
      return {
        ...modification,
        _id,
        entries: copyEntries(modification.entries, timetableIdPairs),
        scenario: newScenarioId,
        variants: newVariants
      }
    } else {
      return {
        ...modification,
        _id,
        scenario: newScenarioId,
        variants: newVariants
      }
    }
  })

  return newModifications.map(m =>
    matchTimetables(m, modificationIdPairs, timetableIdPairs)
  )
}

function copyTimetables (timetables, idPairs) {
  return timetables.map(tt => {
    const timetableId = uuid.v4()
    idPairs.set(tt.timetableId, timetableId)
    return {
      ...tt,
      timetableId
    }
  })
}

function copyEntries (entries, idPairs) {
  return entries.map(e => {
    const entryId = uuid.v4()
    idPairs.set(e.entryId, entryId)
    return {
      ...e,
      entryId
    }
  })
}

function matchTimetables (modification, modificationIdPairs, timetableIdPairs) {
  switch (modification.type) {
    case ADD_TRIP_PATTERN:
      return {
        ...modification,
        timetables: modification.timetables.map(tt =>
          matchTimetable(tt, modificationIdPairs, timetableIdPairs)
        )
      }
    case CONVERT_TO_FREQUENCY:
      return {
        ...modification,
        entries: modification.entries.map(entry =>
          matchTimetable(entry, modificationIdPairs, timetableIdPairs)
        )
      }
    default:
      return modification
  }
}

function matchTimetable (timetable, modificationIdPairs, timetableIdPairs) {
  if (timetable.phaseFromTimetable && timetable.phaseFromTimetable.length > 0) {
    const [modificationId, timetableId] = timetable.phaseFromTimetable.split(
      ':'
    )
    return {
      ...timetable,
      phaseFromTimetable: `${modificationIdPairs.get(modificationId)}:${timetableIdPairs.get(timetableId)}`
    }
  } else {
    return timetable
  }
}
