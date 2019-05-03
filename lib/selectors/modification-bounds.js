import {createSelector} from 'reselect'

// Can import Leaflet here as this is only used directly on the map
import Leaflet from 'lib/leaflet'

import selectRoutePatterns from './route-patterns'

export default createSelector(
  selectRoutePatterns,
  patterns => {
    const geometries = patterns.map(pattern => pattern.geometry)
    const coordinates = geometries.reduce(
      (coordinates, geometry) => coordinates.concat(geometry.coordinates),
      []
    )
    if (coordinates.length > 0) {
      return Leaflet.latLngBounds(
        coordinates.map(c => ({
          lat: c[1],
          lng: c[0]
        }))
      )
    }
  }
)
