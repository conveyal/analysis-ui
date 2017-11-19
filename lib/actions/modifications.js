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
export function copy (_id: string) {
  return fetch({
    url: `/api/modification/${_id}/copy`,
    options: {
      method: 'post'
    },
    next (response) {
      const newModification = response.value
      return [
        {type: 'create modification', payload: newModification},
        setActive(newModification._id),
        push(
          `/projects/${newModification.projectId}/modifications/${newModification._id}`
        )
      ]
    }
  })
}

/**
 * POST to `/api/project/${_id}/import/${importFromId}`
 */
export function copyFromProject ({fromProjectId, toProjectId}: {
  fromProjectId: string,
  toProjectId: string
}) {
  return fetch({
    url: `/api/project/${toProjectId}/import/${fromProjectId}`,
    options: {
      method: 'post'
    },
    next: (response) => [
      {type: 'create modifications', payload: response.value},
      push(`/projects/${toProjectId}`)
    ]
  })
}

export const create = ({name, type}: {
  name: string,
  type: string
}) => (dispatch: Dispatch, getState: GetState) => {
  const {project} = getState()
  const {currentProject, feeds} = project
  const projectId = currentProject._id

  return dispatch(
    fetch({
      url: '/api/modification',
      options: {
        body: createModification({
          feedId: feeds.length > 0 ? feeds[0].id : '',
          name,
          projectId,
          type,
          variants: currentProject.variants.map(v => true)
        }),
        method: 'post'
      },
      next (response) {
        const modification = response.value
        return [
          {type: 'create modification', payload: modification},
          setActive(modification._id),
          push(`/projects/${projectId}/modifications/${modification._id}`)
        ]
      }
    })
  )
}

export const update = (modification: Modification) =>
  (dispatch: Dispatch, getState: GetState) => {
    const {project} = getState()
    const {currentProject} = project

    return dispatch(
      isValid(modification)
        ? [
          set(modification),
          getFeedsRoutesAndStops({
            bundleId: currentProject.bundleId,
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
    }
  })
export const deleteModification = (_id: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const {project} = getState()
    const modifications = project ? project.modifications : []
    return dispatch([
      deleteLocally(_id),
      deleteOnServer(_id),
      clearReferencesToModification({_id, modifications})
    ])
  }

export function getForProject ({bundleId, projectId}: {
  bundleId: string,
  projectId: string
}) {
  return fetch({
    url: `/api/project/${projectId}/modifications`,
    next (response) {
      const modifications = response.value
      return [
        setAll(modifications),
        getFeedsRoutesAndStops({
          bundleId,
          modifications
        })
      ]
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
    next: (response) =>
      setLocally(response.value) // Needed to update the `nonce`
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
