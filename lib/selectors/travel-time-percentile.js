import {createSelector} from 'reselect'

import selectProfileRequest from './profile-request'

export default createSelector(
  selectProfileRequest,
  (pr) => pr.travelTimePercentile || 50
)
