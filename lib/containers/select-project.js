import {connect} from 'react-redux'

import SelectProject from '../components/select-project'
import selectBundlesReady from '../selectors/bundles-ready'
import selectCurrentRegion from '../selectors/current-region'
import selectProjects from '../selectors/projects'

function mapStateToProps(state, ownProps) {
  return {
    bundles: selectBundlesReady(state, ownProps),
    projects: selectProjects(state, ownProps),
    region: selectCurrentRegion(state, ownProps)
  }
}

export default connect(mapStateToProps)(SelectProject)
