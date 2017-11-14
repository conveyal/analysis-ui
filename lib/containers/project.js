// @flow
import {connect} from 'react-redux'

import {clearCurrentProject, load} from '../actions/project'
import Project from '../components/project'

import selectCurrentProject from '../selectors/current-project'

function mapStateToProps (state, props) {
  return {
    project: selectCurrentProject(state, props)
  }
}

export default connect(mapStateToProps, {
  clearCurrentProject,
  load
})(Project)
