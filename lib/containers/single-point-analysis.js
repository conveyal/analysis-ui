import {connect} from 'react-redux'

import {abortFetch} from 'lib/actions/fetch'
import {FETCH_TRAVEL_TIME_SURFACE} from 'lib/constants'
import {
  fetchTravelTimeSurface,
  clearComparisonProject,
  setComparisonProject,
  setDestination,
  setIsochroneFetchStatus,
  setTravelTimeSurface,
  setComparisonTravelTimeSurface
} from 'lib/actions/analysis'
import {setProfileRequest} from 'lib/actions/analysis/profile-request'
import {load as loadAllRegionalAnalyses} from 'lib/actions/analysis/regional'
import SinglePointAnalysis from 'lib/components/analysis'
import * as select from 'lib/selectors'
import get from 'lib/utils/get'

function mapStateToProps(state, ownProps) {
  const comparisonProjectId = get(state, 'analysis.comparisonProjectId')
  const currentProject = select.currentProject(state, ownProps)
  const currentRegion = select.currentRegion(state, ownProps) || {}
  const regionBounds = get(currentRegion, 'bounds')
  const profileRequest = select.profileRequest(state, ownProps)
  const projects = get(state, 'project.projects', [])

  return {
    analysisBounds: select.analysisBounds(state, ownProps),
    bundles: select.bundlesReady(state, ownProps),
    comparisonDestinationTravelTimeDistribution: select.comparisonDestinationTravelTimeDistribution(
      state
    ),
    comparisonProject: projects.find((p) => p._id === comparisonProjectId),
    comparisonIsochrone: select.comparisonIsochrone(state),
    comparisonVariant: get(state, 'analysis.comparisonVariant'),
    currentBundle: select.currentBundle(state, ownProps),
    currentProject,
    destination: get(state, 'analysis.destination'),
    destinationTravelTimeDistribution: select.destinationTravelTimeDistribution(
      state
    ),
    isochrone: select.isochrone(state),
    isochroneCutoff: select.maxTripDurationMinutes(state, ownProps),
    isochroneFetchStatus: get(state, 'analysis.isochroneFetchStatus'),
    profileRequest,
    profileRequestHasChanged: select.profileRequestHasChanged(state, ownProps),
    profileRequestLonLat: select.profileRequestLonLat(state, ownProps),
    regionId: select.currentRegionId(state, ownProps),
    regionalAnalyses: select.regionalAnalyses(state, ownProps),
    regionBounds,
    scenarioApplicationErrors: get(state, 'analysis.scenarioApplicationErrors'),
    scenarioApplicationWarnings: get(
      state,
      'analysis.scenarioApplicationWarnings'
    ),
    projects
  }
}

const clearTravelTimeSurfaces = () => [
  setTravelTimeSurface(null),
  setComparisonTravelTimeSurface(null)
]

const mapDispatchToProps = {
  abortFetchTravelTimeSurface: () => [
    abortFetch({type: FETCH_TRAVEL_TIME_SURFACE}),
    setIsochroneFetchStatus(false)
  ],
  clearComparisonProject,
  clearTravelTimeSurfaces,
  fetchTravelTimeSurface,
  loadAllRegionalAnalyses,
  removeDestination: () => setDestination(),
  setComparisonProject,
  setDestination,
  setProfileRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
