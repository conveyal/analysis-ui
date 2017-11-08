// @flow
import {connect} from 'react-redux'

import {setLocally} from '../actions/project'
import EditProjectBounds from '../components/map/edit-project-bounds'

import selectCurrentProject from '../selectors/current-project'

function mapStateToProps (state, ownProps) {
  const project = selectCurrentProject(state, ownProps) || {}
  return {
    bounds: project.bounds || {},
    isLoaded: !!project.bounds,
    project
  }
}

export default connect(mapStateToProps, {setLocally})(EditProjectBounds)
