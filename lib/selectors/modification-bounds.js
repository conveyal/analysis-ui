import flatMap from 'lodash/flatMap'
import get from 'lodash/get'
import lonlat from '@conveyal/lonlat'
import {createSelector} from 'reselect'

// Can import Leaflet here as this is only used directly on the map
import Leaflet from 'lib/leaflet'

import {ADD_STREETS, MODIFY_STREETS} from '../constants'

import selectActiveModification from './active-modification'
import selectRoutePatterns from './route-patterns'

function getCoordinatesFromModification(m, patterns) {
  const type = get(m, 'type')
  if (type === ADD_STREETS) {
    return flatMap(m.lineStrings, (lineString) =>
      lineString.map(lonlat.toLeaflet)
    )
  } else if (type === MODIFY_STREETS) {
    return flatMap(m.polygons, (polygon) => polygon.map(lonlat.toLeaflet))
  } else {
    const geometries = [
      ...get(m, 'segments', [])
        .map((s) => s.geometry)
        .filter((g) => g.type !== 'Point'),
      ...(patterns || []).map((p) => p.geometry)
    ]
    return flatMap(geometries, (g) => g.coordinates.map(lonlat.toLeaflet))
  }
}

export default createSelector(
  selectActiveModification,
  selectRoutePatterns,
  (m, patterns) => {
    const coords = getCoordinatesFromModification(m, patterns)
    if (coords.length > 1) {
      return Leaflet.latLngBounds(coords)
    }
  }
)
