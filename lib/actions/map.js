import lonlat from '@conveyal/lonlat'
import {createAction} from 'redux-actions'

export const addComponent = createAction('add component to map')
export const removeComponent = createAction('remove component from map')

export const setCenter = createAction('set map center', (x) => lonlat(x))
export const setZoom = createAction('set map zoom')
