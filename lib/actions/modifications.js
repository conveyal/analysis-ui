// @flow
import fetch from '@conveyal/woonerf/fetch'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

import {lockUiWithError} from './'
import copyModification from '../utils/copy-modification'
import copyModifications from '../utils/copy-modifications'
import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'
import {
  create as createModification,
  formatForServer,
  isValid
} from '../utils/modification'

import type {Modification} from '../types'

type GetState = () => any

/**
 * TODO: Move to a server side API call?
 * POST the modification to `/api/modification/copy` ?
 */
export function copy ({modification}: {modification: Modification}) {
  return fetch({
    url: '/api/modification',
    options: {
      body: copyModification(modification),
      method: 'post'
    },
    next (error, response) {
      if (!error) {
        const newModification = response.value
        return [
          setLocally(newModification),
          push(
            `/scenarios/${modification.scenarioId}/modifications/${newModification._id}`
          )
        ]
      }
    }
  })
}

/**
 * TODO: Move to a server side API call?
 * POST a scenario id to `/api/scenario/copy-modifications`?
 */
export function copyFromScenario ({fromScenarioId, toScenarioId, variants}: {
  fromScenarioId: string,
  toScenarioId: string,
  variants: boolean[]
}) {
  return fetch({
    url: `/api/scenario/${fromScenarioId}/modifications`,
    next: (error, response) =>
      !error &&
      copyModifications(
        response.value,
        toScenarioId,
        variants
      ).map(newModification => set(newModification))
  })
}

export const create = ({name, type}: {
  name: string,
  type: string
}) => (dispatch: Dispatch, getState: GetState) => {
  const {scenario} = getState()
  const {currentScenario, feeds} = scenario
  const scenarioId = currentScenario._id

  return dispatch(
    fetch({
      url: '/api/modification',
      options: {
        body: createModification({
          feedId: feeds.length > 0 ? feeds[0].id : '',
          name,
          scenarioId,
          type,
          variants: currentScenario.variants.map(v => true)
        }),
        method: 'post'
      },
      next (error, response) {
        if (!error) {
          const modification = response.value
          return [
            setLocally(modification),
            push(`/scenarios/${scenarioId}/modifications/${modification._id}`)
          ]
        }
      }
    })
  )
}

export const update = (modification: Modification) =>
  (dispatch: Dispatch, getState: GetState) => {
    const {scenario} = getState()
    const {currentScenario} = scenario

    return dispatch(
      isValid(modification)
        ? [
          set(modification),
          getFeedsRoutesAndStops({
            bundleId: currentScenario.bundleId,
            modifications: [modification]
          })
        ]
        : [lockUiWithError('Modification is not valid after operation')]
    )
  }

const deleteLocally = createAction('delete modification')
const deleteOnServer = _id =>
  fetch({
    url: `/api/modification/${_id}`,
    options: {
      method: 'delete'
    },
    next () {}
  })
export const deleteModification = (_id: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const {scenario} = getState()
    const modifications = scenario ? scenario.modifications : []
    return dispatch([
      deleteLocally(_id),
      deleteOnServer(_id),
      clearReferencesToModification({_id, modifications})
    ])
  }

export function getForScenario ({bundleId, scenarioId}: {
  bundleId: string,
  scenarioId: string
}) {
  return fetch({
    url: `/api/scenario/${scenarioId}/modifications`,
    next (error, response) {
      if (!error) {
        const modifications = response.value
        return [
          setAll(modifications),
          getFeedsRoutesAndStops({
            bundleId,
            modifications
          })
        ]
      }
    }
  })
}

export const saveToServer = (m: Modification) =>
  fetch({
    url: `/api/modification/${m._id}`,
    options: {
      body: formatForServer(m),
      method: 'put'
    },
    next (error, response) {
      if (!error) {
        return setLocally(response.value)
      }
    }
  })

export const set = (m: Modification) => [setLocally(m), saveToServer(m)]
export const setActive = createAction('set active modification')
const setAll = createAction('set modifications')
export const setAndRetrieveData = ({bundleId, modification}: {
  bundleId: string,
  modification: Modification
}) =>
  (isValid(modification)
    ? [
      set(modification),
      getFeedsRoutesAndStops({bundleId, modifications: [modification]})
    ]
    : [lockUiWithError('Modification is not valid after operation')])

export const setLocally = createAction('set modification')

/**
 * When deleting a modification's timetable it might have been referenced from
 * other timetables. Ensure that those references are cleared.
 */
export function clearReferencesToTimetable (timetableId: string, modifications: Modification[]) {
  const timetableMatches = tt =>
    tt.phaseFromTimetable && tt.phaseFromTimetable.split(':')[1] === timetableId
  const modificationReferencesTimetable = tts =>
    tts && tts.length > 0 && !!tts.find(timetableMatches)
  const clearTimetableReferences = tt =>
    (timetableMatches(tt)
      ? {...tt, phaseFromTimetable: null, phaseFromStop: null}
      : tt)

  return modifications
    .filter(m => modificationReferencesTimetable(m.entries || m.timetables))
    .map(
      m =>
        (m.entries
          ? set({...m, entries: m.entries.map(clearTimetableReferences)})
          : set({...m, timetables: (m.timetables || []).map(clearTimetableReferences)}))
    )
}

/**
 * When deleting a modification it might have been referenced from other
 * modifications. Ensure that those references are cleared.
 */
export const clearReferencesToModification = createAction(
  'clear references to modification',
  ({_id, modifications}) => {
    const timetableMatches = tt =>
      tt.phaseFromTimetable && tt.phaseFromTimetable.split(':')[0] === _id
    const referencesModification = tts =>
      tts && tts.length > 0 && !!tts.find(timetableMatches)
    const clearTimetableReferences = tt =>
      (timetableMatches(tt)
        ? {...tt, phaseFromTimetable: null, phaseFromStop: null}
        : tt)

    return modifications
      .filter(m => referencesModification(m.entries || m.timetables))
      .map(
        m =>
          (m.entries
            ? set({...m, entries: m.entries.map(clearTimetableReferences)})
            : set({
              ...m,
              timetables: m.timetables.map(clearTimetableReferences)
            }))
      )
  }
)
