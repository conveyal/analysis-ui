import lonlat from '@conveyal/lonlat'
import {createAction} from 'redux-actions'

export const setCenter = createAction('set map center', x => lonlat(x))
export const setZoom = createAction('set map zoom')
