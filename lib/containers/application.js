// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {clearError} from '../actions'
import {load as loadRegion} from '../actions/region'
import {setCenter as setMapCenter} from '../actions/map'
import Application from '../components/application'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const {mapState, network, user, analysis} = state
  const {error, outstandingRequests} = network
  const hasError = !!error

  const projectId = select.currentProjectId(state, props)
  return {
    activeModificationId: select.activeModificationId(state, props),
    bundleId: select.bundleId(state, props),
    center: mapState.center,
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    hasError,
    hasProject: !!projectId,
    mapComponents: mapState.components || [],
    modificationBounds: select.modificationBounds(state, props),
    outstandingRequests,
    regionId: select.currentRegionId(state, props),
    projectId,
    projectIsLoaded: select.projectIsLoaded(state, props),
    username: user.profile && user.profile.name,
    zoom: mapState.zoom,
    analysisMode: analysis.active
  }
}

const mapDispatchToProps = {
  clearError,
  loadRegion,
  push,
  setMapCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
