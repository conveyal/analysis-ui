// @flow
import {LatLngBounds} from 'leaflet'
import {createSelector} from 'reselect'

import selectProfileRequest from './profile-request'

export default createSelector(
  selectProfileRequest,
  (profileRequest) => {
    const bounds = profileRequest.bounds
    return new LatLngBounds([
      [bounds.north, bounds.west],
      [bounds.south, bounds.east]
    ])
  }
)
