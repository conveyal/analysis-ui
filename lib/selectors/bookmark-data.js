// @flow
import {createSelector} from 'reselect'

import OpportunityDatasets from '../modules/opportunity-datasets'

export default createSelector(
  OpportunityDatasets.selectors.selectActiveOpportunityDataset,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.isochroneLonLat,
  state => state.analysis.profileRequest,
  state => state.project.currentProject._id,
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
