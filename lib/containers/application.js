// @flow
import {connect} from 'react-redux'

import {load as loadRegion} from '../actions/region'
import Application from '../components/application'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const {mapState, analysis} = state

  const projectId = select.currentProjectId(state, props)
  return {
    hasProject: !!projectId,
    mapComponents: mapState.components || [],
    regionId: select.currentRegionId(state, props),
    projectId,
    projectIsLoaded: select.projectIsLoaded(state, props),
    analysisMode: analysis.active
  }
}

export default connect(mapStateToProps, {loadRegion})(Application)
