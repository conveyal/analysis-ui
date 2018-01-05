// @flow
import {connect} from 'react-redux'

import SelectProject from '../components/select-project'
import selectCurrentRegion from '../selectors/current-region'
import get from '../utils/get'

function mapStateToProps (state, ownProps) {
  return {
    region: selectCurrentRegion(state, ownProps),
    projects: get(state, 'project.projects', [])
  }
}

export default connect(mapStateToProps)(SelectProject)
