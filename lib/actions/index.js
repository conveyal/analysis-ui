import {createAction} from 'redux-actions'

export const deleteBundle = createAction('delete bundle')
export const deleteModification = createAction('delete modification')
export const loadProjects = createAction('load projects')
export const logout = createAction('log out')
export const replaceModification = createAction('replace modification')
export const setBundle = createAction('set bundle')
/** update map state */
export const setMapState = createAction('set map state')
export const setProject = createAction('set project')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const updateData = createAction('update data')
/** update available variants */
export const updateVariants = createAction('update variants')
