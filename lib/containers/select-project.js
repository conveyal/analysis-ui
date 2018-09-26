// @flow
import {connect} from 'react-redux'

import SelectProject from '../components/select-project'
import * as select from '../selectors'
import get from '../utils/get'

function mapStateToProps (state, ownProps) {
  return {
    bundles: select.bundlesReady(state, ownProps),
    region: select.currentRegion(state, ownProps),
    projects: get(state, 'project.projects', [])
  }
}

export default connect(mapStateToProps)(SelectProject)
