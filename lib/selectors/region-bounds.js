import {createSelector} from 'reselect'

import Leaflet from 'lib/leaflet'

import selectCurrentRegion from './current-region'

export default createSelector(
  selectCurrentRegion,
  r =>
    r
      ? Leaflet.latLngBounds(
          [r.bounds.north, r.bounds.east],
          [r.bounds.south, r.bounds.west]
        )
      : null
)
