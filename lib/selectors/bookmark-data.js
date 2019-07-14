import {createSelector} from 'reselect'

import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'

import selectCurrentRegionId from './current-region-id'
import selectProfileRequest from './profile-request'

export default createSelector(
  activeOpportunityDataset,
  selectProfileRequest,
  selectCurrentRegionId,
  (opportunityDataset, profileRequest, regionId) => ({
    opportunityDataset: opportunityDataset && opportunityDataset.key,
    profileRequest,
    regionId
  })
)
