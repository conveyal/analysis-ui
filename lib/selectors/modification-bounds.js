// @flow
import lonlat from '@conveyal/lonlat'
import {latLngBounds} from 'leaflet'
import {createSelector} from 'reselect'

import selectRoutePatterns from './route-patterns'

export default createSelector(
  selectRoutePatterns,
  (patterns) => {
    const geometries = patterns.map((pattern) => pattern.geometry)
    const coordinates = geometries.reduce((coordinates, geometry) => coordinates.concat(geometry.coordinates), [])
    if (coordinates.length > 0) {
      const bounds = latLngBounds(lonlat(coordinates[0]))
      coordinates.forEach((coordinate) => bounds.extend(lonlat(coordinate)))
      bounds.pad(1.25)
      return bounds
    }
  }
)
