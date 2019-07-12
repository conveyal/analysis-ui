import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {ADD_TRIP_PATTERN} from 'lib/constants'

// Can import Leaflet here as this is only used directly on the map
import Leaflet from 'lib/leaflet'

import selectActiveModification from './active-modification'
import selectRoutePatterns from './route-patterns'

export default createSelector(
  selectActiveModification,
  selectRoutePatterns,
  (m, patterns) => {
    let geometries = []
    if (get(m, 'type') !== ADD_TRIP_PATTERN) {
      geometries = patterns.map(p => p.geometry)
    } else if (get(m, 'segments.length') > 1) {
      geometries = m.segments.map(s => s.geometry)
    }
    const coords = geometries.reduce(
      (c, g) => c.concat(g.coordinates.map(lonlat.toLeaflet)),
      []
    )
    if (coords.length > 1) {
      return Leaflet.latLngBounds(coords)
    }
  }
)
