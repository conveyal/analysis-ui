import {createSelector} from 'reselect'

import selectProfileRequest from './profile-request'

export default createSelector(
  selectProfileRequest,
  (profileRequest) => profileRequest.bounds
)
