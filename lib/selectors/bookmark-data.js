// @flow
import {createSelector} from 'reselect'

import selectCurrentRegionId from './current-region-id'
import {activeOpportunityDataset} from '../modules/opportunity-datasets/selectors'

export default createSelector(
  activeOpportunityDataset,
  state => state.analysis.profileRequest,
  selectCurrentRegionId,
  (
    opportunityDataset,
    profileRequest,
    regionId
  ) => ({
    opportunityDataset: opportunityDataset && opportunityDataset.key,
    profileRequest,
    regionId
  })
)
