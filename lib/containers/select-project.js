import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {create} from '../actions/project'
import SelectProject from '../components/select-project'

function mapStateToProps ({
  project
}) {
  return {
    projects: project.projects
  }
}

function mapDispatchToProps (dispatch) {
  return {
    create: () => dispatch(create()),
    push: (url) => dispatch(push(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
