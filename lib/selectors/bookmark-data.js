// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.analysis.currentIndicator,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.isochroneLonLat,
  state => state.analysis.profileRequest,
  state => state.project.currentProject.id,
  (
    destinationGrid,
    isochroneCutoff,
    isochroneLonLat,
    profileRequest,
    projectId
  ) => ({
    destinationGrid,
    isochroneCutoff,
    profileRequest: {
      ...profileRequest,
      fromLat: isochroneLonLat && isochroneLonLat.lat,
      fromLon: isochroneLonLat && isochroneLonLat.lon
    },
    projectId
  })
)
