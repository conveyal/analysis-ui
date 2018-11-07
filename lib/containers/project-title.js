// @flow
import {connect} from 'react-redux'

import {downloadScenario, downloadGeojson} from '../actions/project'
import ProjectTitle from '../components/project-title'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    _id: select.currentProjectId(state, props),
    project: select.currentProject(state, props)
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    downloadScenario: index => dispatch(downloadScenario(index)),
    downloadGeojson: index => dispatch(downloadGeojson(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle)
