// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import SinglePointAnalysis from '../components/analysis'
import {loadBundle} from '../actions'
import {
  fetchTravelTimeSurface,
  clearComparisonProject,
  setComparisonProject,
  setDestination,
  setProfileRequest,
  setTravelTimeSurface,
  setComparisonTravelTimeSurface
} from '../actions/analysis'
import {load as setCurrentProject} from '../actions/project'
import {
  load as loadAllRegionalAnalyses,
  createRegionalAnalysis
} from '../actions/analysis/regional'
import * as select from '../selectors'
import downloadJson from '../utils/download-json'
import get from '../utils/get'

function mapStateToProps (state, ownProps) {
  const comparisonProjectId = get(state, 'analysis.comparisonProjectId')
  const currentProject = select.currentProject(state, ownProps)
  const currentRegion = select.currentRegion(state, ownProps) || {}
  const regionBounds = get(currentRegion, 'bounds')
  const profileRequest = select.profileRequest(state, ownProps)
  const projects = get(state, 'project.projects', [])

  return {
    analysisBounds: select.analysisBounds(state, ownProps),
    bundles: select.bundlesReady(state, ownProps),
    comparisonDestinationTravelTimeDistribution: select.comparisonDestinationTravelTimeDistribution(state),
    comparisonProject: projects.find(p => p._id === comparisonProjectId),
    comparisonIsochrone: select.comparisonIsochrone(state),
    comparisonVariant: get(state, 'analysis.comparisonVariant'),
    currentBundle: select.currentBundle(state, ownProps),
    currentProject,
    destination: get(state, 'analysis.destination'),
    destinationTravelTimeDistribution: select.destinationTravelTimeDistribution(state),
    isFetchingIsochrone: !!get(state, 'analysis.isFetchingIsochrone'),
    isochrone: select.isochrone(state),
    isochroneFetchStatusMessage: get(state, 'analysis.isochroneFetchStatusMessage'),
    profileRequest,
    profileRequestHasChanged: select.profileRequestHasChanged(state, ownProps),
    profileRequestLatLng: select.profileRequestLatLng(state, ownProps),
    regionId: select.currentRegionId(state, ownProps),
    regionalAnalyses: select.regionalAnalyses(state, ownProps),
    regionBounds,
    scenarioApplicationErrors: get(state, 'analysis.scenarioApplicationErrors'),
    scenarioApplicationWarnings: get(state, 'analysis.scenarioApplicationWarnings'),
    projects
  }
}

const downloadIsochrone = () => (dispatch, getState) => {
  const state = getState()
  const isochrone = select.isochrone(state)
  const currentProject = select.currentProject(state)
  if (!currentProject) return

  const activeVariant = get(state, 'analysis.activeVariant')
  const cutoff = select.maxTripDurationMinutes(state)
  const name = currentProject.name
  const variantName = currentProject.variants[activeVariant]
  downloadJson({
    data: {
      ...isochrone,
      properties: null // TODO set this in jsolines
    },
    filename: `analysis-isochrone-${name}-${variantName}-${cutoff}-minutes.json`
  })
}

const downloadComparisonIsochrone = () => (dispatch, getState) => {
  const state = getState()
  const comparisonIsochrone = select.comparisonIsochrone(state)
  const {analysis} = state
  const cutoff = select.maxTripDurationMinutes(state)
  const comparisonProject = select.comparisonProject(state)
  const variantName = comparisonProject.variants[analysis.comparisonVariant] || 'baseline'
  downloadJson({
    data: {
      ...comparisonIsochrone,
      properties: null // TODO set this in jsolines
    },
    filename: `analysis-isochrone-${comparisonProject.name}-${variantName}-${cutoff}-minutes.json`
  })
}

const setComparisonProjectAndLoadItsBundle = (project) => [
  setProfileRequest({comparisonProjectId: project._id}),
  setComparisonProject(project),
  loadBundle(project.bundleId)
]

const clearTravelTimeSurfaces = () => [
  setTravelTimeSurface(null),
  setComparisonTravelTimeSurface(null)
]

const mapDispatchToProps = {
  clearComparisonProject,
  clearTravelTimeSurfaces,
  createRegionalAnalysis,
  downloadComparisonIsochrone,
  downloadIsochrone,
  fetchTravelTimeSurface,
  loadAllRegionalAnalyses,
  push,
  removeDestination: () => setDestination(),
  setComparisonProject: setComparisonProjectAndLoadItsBundle,
  setCurrentProject,
  setDestination,
  setProfileRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
