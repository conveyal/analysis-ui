// @flow
import {createSelector} from 'reselect'

import selectCurrentProjectId from './current-project-id'
import OpportunityDatasets from '../modules/opportunity-datasets'

export default createSelector(
  OpportunityDatasets.selectors.selectActiveOpportunityDataset,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.isochroneLonLat,
  state => state.analysis.profileRequest,
  selectCurrentProjectId,
  (
    opportunityDataset,
    isochroneCutoff,
    isochroneLonLat,
    profileRequest,
    projectId
  ) => ({
    opportunityDataset: opportunityDataset && opportunityDataset.key,
    isochroneCutoff,
    profileRequest: {
      ...profileRequest,
      fromLat: isochroneLonLat && isochroneLonLat.lat,
      fromLon: isochroneLonLat && isochroneLonLat.lon
    },
    projectId
  })
)
