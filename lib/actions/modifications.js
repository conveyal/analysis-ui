// @flow
import fetch, {fetchMultiple} from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import * as select from '../selectors'
import {
  create as createModification,
  formatForServer,
  isValid
} from '../utils/modification'
import type {Modification} from '../types'

import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'

import {lockUiWithError} from './'

type GetState = () => any

const MODIFICATION_URL = `${process.env.API_URL}/modification`
const PROJECT_URL = `${process.env.API_URL}/project`

/**
 * POST the modification to `/api/modification/${_id}/copy`
 */
export function copy(_id: string) {
  return fetch({
    url: `${MODIFICATION_URL}/${_id}/copy`,
    options: {
      method: 'post'
    },
    next: response => ({
      type: 'create modification',
      payload: response.value
    })
  })
}

/**
 * POST to `/api/project/${_id}/import/${importFromId}`
 */
export function copyFromProject({
  fromProjectId,
  regionId,
  toProjectId
}: {
  fromProjectId: string,
  regionId: string,
  toProjectId: string
}) {
  return fetch({
    url: `${PROJECT_URL}/${toProjectId}/import/${fromProjectId}`,
    options: {
      method: 'post'
    },
    next: response => {
      return [
        {type: 'create modifications', payload: response.value},
        push(`/regions/${regionId}/projects/${toProjectId}`)
      ]
    }
  })
}

export const create = ({name, type}: {name: string, type: string}) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const projectId = select.currentProjectId(state)
  const regionId = select.currentRegionId(state)
  const variants = select.variants(state)
  const feeds = state.project.feeds

  return dispatch(
    fetch({
      url: MODIFICATION_URL,
      options: {
        body: createModification({
          feedId: feeds.length > 0 ? feeds[0].id : '',
          name,
          projectId,
          type,
          variants: variants.map(v => true)
        }),
        method: 'post'
      },
      next(response) {
        const m = response.value
        return [
          {type: 'create modification', payload: response.value},
          push(
            `/regions/${regionId}/projects/${projectId}/modifications/${m._id}`
          )
        ]
      }
    })
  )
}

/**
 * Create multiple modifications and navigate to the project
 */
export const createMultiple = (modifications: Modification[]) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const regionId = select.currentRegionId(state, {})
  const projectId = select.currentProjectId(state, {})

  dispatch(
    fetchMultiple({
      fetches: modifications.map(m => ({
        url: MODIFICATION_URL,
        options: {
          body: m,
          method: 'post'
        }
      })),
      next: responses => [
        {type: 'create modifications', payload: responses.map(r => r.value)},
        push(`/regions/${regionId}/projects/${projectId}`)
      ]
    })
  )
}

export const update = (modification: Modification) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const bundleId = select.bundleId(state, {})

  return dispatch(
    isValid(modification)
      ? [
          setLocally(modification),
          saveToServer(modification),
          getFeedsRoutesAndStops({
            bundleId,
            modifications: [modification]
          })
        ]
      : [lockUiWithError('Modification is not valid after operation')]
  )
}

const deleteLocally = createAction('delete modification')
const deleteOnServer = _id =>
  fetch({
    url: `${MODIFICATION_URL}/${_id}`,
    options: {
      method: 'delete'
    }
  })
export const deleteModification = (_id: string) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const {project} = getState()
  const modifications = project ? project.modifications : []
  return dispatch([
    deleteLocally(_id),
    deleteOnServer(_id),
    clearReferencesToModification({_id, modifications})
  ])
}

export function getForProject({
  bundleId,
  projectId
}: {
  bundleId: string,
  projectId: string
}) {
  return fetch({
    url: `${PROJECT_URL}/${projectId}/modifications`,
    next(response) {
      const modifications = response.value
      return [
        setAll(modifications),
        getFeedsRoutesAndStops({
          bundleId,
          forceCompleteUpdate: true,
          modifications
        })
      ]
    }
  })
}

const updateLocally = createAction('update modification')
export const saveToServer = (m: Modification) =>
  fetch({
    type: `put ${m._id}`,
    url: `${MODIFICATION_URL}/${m._id}`,
    options: {
      body: formatForServer(m),
      method: 'put'
    },
    next: response =>
      updateLocally({
        _id: m._id,
        nonce: response.value.nonce // Needed to update the `nonce`
      })
  })

export const setActive = createAction('set active modification')
export const setAll = createAction('set modifications')
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
      timetableMatches(tt)
        ? {...tt, phaseFromTimetable: null, phaseFromStop: null}
        : tt

    return modifications
      .filter(m => referencesModification(m.entries || m.timetables))
      .map(m =>
        m.entries
          ? saveToServer({
              ...m,
              entries: m.entries.map(clearTimetableReferences)
            })
          : saveToServer({
              ...m,
              timetables: m.timetables.map(clearTimetableReferences)
            })
      )
  }
)
