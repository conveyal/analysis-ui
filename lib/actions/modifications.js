import Router from 'next/router'
import {createAction} from 'redux-actions'

import {RouteTo} from '../constants'
import fetch, {fetchMultiple} from '../fetch-action'
import selectBundleId from '../selectors/bundle-id'
import selectCurrentProjectId from '../selectors/current-project-id'
import selectCurrentRegionId from '../selectors/current-region-id'
import selectVariants from '../selectors/variants'
import {
  create as createModification,
  formatForServer,
  isValid
} from '../utils/modification'

import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'

const MODIFICATION_URL = `${process.env.API_URL}/modification`
const PROJECT_URL = `${process.env.API_URL}/project`

/**
 * POST the modification to `/api/modification/${_id}/copy`
 */
export function copy(_id) {
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
export const copyFromProject = ({
  fromProjectId,
  regionId,
  toProjectId
}) => async dispatch => {
  const modifications = await dispatch(
    fetch({
      url: `${PROJECT_URL}/${toProjectId}/import/${fromProjectId}`,
      options: {
        method: 'post'
      }
    })
  )

  dispatch({type: 'create modifications', payload: modifications})

  return modifications
}

export const create = ({name, type}) => async (dispatch, getState) => {
  const state = getState()
  const projectId = selectCurrentProjectId(state)
  const regionId = selectCurrentRegionId(state)
  const variants = selectVariants(state)
  const feeds = state.project.feeds

  const modification = await dispatch(
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
      }
    })
  )

  dispatch({type: 'create modification', payload: modification})

  Router.push({
    pathname: RouteTo.modificationEdit,
    query: {regionId, projectId, modificationId: modification._id}
  })

  return modification
}

/**
 * Create multiple modifications and navigate to the project
 */
export const createMultiple = modifications => async dispatch => {
  const newModifications = await dispatch(
    fetchMultiple({
      fetches: modifications.map(m => ({
        url: MODIFICATION_URL,
        options: {
          body: m,
          method: 'post'
        }
      }))
    })
  )

  dispatch({type: 'create modifications', payload: newModifications})

  return newModifications
}

export const update = modification => (dispatch, getState) => {
  const state = getState()
  const bundleId = selectBundleId(state, {})

  if (!isValid(modification)) {
    return dispatch(lockUIWithError('Modification is not valid after edit.'))
  }

  dispatch(setLocally(modification))

  return Promise.all([
    dispatch(saveToServer(modification)),
    dispatch(getFeedsRoutesAndStops({bundleId, modifications: [modification]}))
  ])
}

const deleteLocally = createAction('delete modification')
const deleteOnServer = _id =>
  fetch({
    url: `${MODIFICATION_URL}/${_id}`,
    options: {
      method: 'delete'
    }
  })
export const deleteModification = _id => (dispatch, getState) => {
  const {project} = getState()
  const modifications = project ? project.modifications : []

  // Eagerly delete, any serious errors would cause a page reload anyway.
  dispatch(deleteLocally(_id))

  return Promise.all([
    dispatch(deleteOnServer(_id)),
    dispatch(clearReferencesToModification({_id, modifications}))
  ])
}

export const getForProject = projectId =>
  fetch({
    url: `${PROJECT_URL}/${projectId}/modifications`,
    next: r => setAll(r.value)
  })

const updateLocally = createAction('update modification')
export const saveToServer = m =>
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
export const clearReferencesToModification = ({
  _id,
  modifications
}) => dispatch => {
  const timetableMatches = tt =>
    tt.phaseFromTimetable && tt.phaseFromTimetable.split(':')[0] === _id
  const referencesModification = tts =>
    tts && tts.length > 0 && !!tts.find(timetableMatches)
  const clearTimetableReferences = tt =>
    timetableMatches(tt)
      ? {...tt, phaseFromTimetable: null, phaseFromStop: null}
      : tt

  return Promise.all(
    modifications
      .filter(m => referencesModification(m.entries || m.timetables))
      .map(m =>
        m.entries
          ? dispatch(
              saveToServer({
                ...m,
                entries: m.entries.map(clearTimetableReferences)
              })
            )
          : dispatch(
              saveToServer({
                ...m,
                timetables: m.timetables.map(clearTimetableReferences)
              })
            )
      )
  )
}
