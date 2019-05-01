import {connect} from 'react-redux'

import SelectProject from '../components/select-project'
import selectBundlesReady from '../selectors/bundles-ready'
import selectCurrentRegion from '../selectors/current-region'
import get from '../utils/get'

function mapStateToProps(state, ownProps) {
  return {
    bundles: selectBundlesReady(state, ownProps),
    projects: get(state, 'project.projects', []),
    region: selectCurrentRegion(state, ownProps)
  }
}

export default connect(mapStateToProps)(SelectProject)
