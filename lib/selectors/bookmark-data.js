// @flow
import {createSelector} from 'reselect'

import selectCurrentRegionId from './current-region-id'
import OpportunityDatasets from '../modules/opportunity-datasets'

export default createSelector(
  OpportunityDatasets.selectors.selectActiveOpportunityDataset,
  state => state.analysis.isochroneLonLat,
  state => state.analysis.profileRequest,
  selectCurrentRegionId,
  (
    opportunityDataset,
    isochroneLonLat,
    profileRequest,
    regionId
  ) => ({
    opportunityDataset: opportunityDataset && opportunityDataset.key,
    profileRequest: {
      ...profileRequest,
      fromLat: isochroneLonLat && isochroneLonLat.lat,
      fromLon: isochroneLonLat && isochroneLonLat.lon
    },
    regionId
  })
)
