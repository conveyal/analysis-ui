// @flow
import {connect} from 'react-redux'

import {loadR5Versions} from '../actions'
import {clearCurrentProject, load} from '../actions/project'
import Project from '../components/project'

import selectCurrentProject from '../selectors/current-project'
import selectR5Versions from '../selectors/r5-versions'

function mapStateToProps (state, props) {
  return {
    availableR5Versions: selectR5Versions(state, props),
    project: selectCurrentProject(state, props)
  }
}

export default connect(mapStateToProps, {
  clearCurrentProject,
  load,
  loadR5Versions
})(Project)
