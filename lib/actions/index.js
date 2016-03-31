import {createAction} from 'redux-actions'

export const loadProjects = createAction('load projects')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const updateData = createAction('update data')
