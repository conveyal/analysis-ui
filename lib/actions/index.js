import {createAction} from 'redux-actions'
import authenticatedFetch from '../utils/authenticated-fetch'

export const deleteBundle = createAction('delete bundle')
export const loadProjects = createAction('load projects')
export const login = createAction('log in')
export const logout = createAction('log out')

export const deleteModification = createAction('delete modification', modificationId => {
  authenticatedFetch(`/api/modification/${modificationId}`, {
    method: 'delete'
  })

  return modificationId
})

export const replaceModification = createAction('replace modification', m => {
  authenticatedFetch(`/api/modification/${m.id}`, {
    method: 'put',
    body: JSON.stringify(m)
  })

  return m
})

export const setBundle = createAction('set bundle')
/** update map state */
export const setMapState = createAction('set map state')
export const setProject = createAction('set project')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const updateData = createAction('update data')
/** update available variants */
export const updateVariants = createAction('update variants')
