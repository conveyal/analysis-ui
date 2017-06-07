import {connect} from 'react-redux'

import {loadR5Versions} from '../actions'
import {load} from '../actions/project'
import Project from '../components/project'
import r5VersionUnsupported from '../selectors/r5-version-unsupported'

function mapStateToProps (state, props) {
  return {
    project: state.project.projectsById[props.params.projectId],
    r5VersionUnsupported: r5VersionUnsupported(state)
  }
}

export default connect(mapStateToProps, {load, loadR5Versions})(Project)
