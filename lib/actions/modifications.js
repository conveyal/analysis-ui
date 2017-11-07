// @flow
import fetch from '@conveyal/woonerf/fetch'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

import {lockUiWithError} from './'
import selectBundleId from '../selectors/bundle-id'
import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'
import {
  create as createModification,
  formatForServer,
  isValid
} from '../utils/modification'

import type {Modification} from '../types'

type GetState = () => any

/**
 * POST the modification to `/api/modification/${_id}/copy`
 */
export function copy ({modification}: {modification: Modification}) {
  return fetch({
    url: `/api/modification/${modification._id}`,
    options: {
      method: 'post'
    },
    next (error, response) {
      if (!error) {
        const newModification = response.value
        return [
          {type: 'create modification', payload: newModification},
          push(
            `/scenarios/${newModification.scenarioId}/modifications/${newModification._id}`
          )
        ]
      }
    }
  })
}

/**
 * POST to `/api/scenario/${_id}/import/${importFromId}`
 */
export function copyFromScenario ({fromScenarioId, toScenarioId}: {
  fromScenarioId: string,
  toScenarioId: string
}) {
  return fetch({
    url: `/api/scenario/${toScenarioId}/import/${fromScenarioId}`,
    options: {
      method: 'post'
    },
    next: (error, response) => {
      if (!error) {
        return {
          type: 'create modifications',
          payload: response.value
        }
      }
    }
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
            {type: 'create modification', payload: modification},
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
        return setLocally(response.value) // Needed to update the `nonce`
      }
    }
  })

export const set = (m: Modification) => saveToServer(m)
export const setActive = createAction('set active modification')
const setAll = createAction('set modifications')
export const setAndRetrieveData = (modification: Modification) =>
  (dispatch: Dispatch, getState: () => any) => {
    const state = getState()
    const bundleId = selectBundleId(state, {})
    if (isValid(modification)) {
      dispatch([
        saveToServer(modification),
        getFeedsRoutesAndStops({bundleId, modifications: [modification]})
      ])
    } else {
      dispatch(lockUiWithError('Modification is not valid after operation'))
    }
  }

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
