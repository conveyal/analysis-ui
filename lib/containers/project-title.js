// @flow
import {connect} from 'react-redux'

import {downloadScenario, downloadLines, downloadStops} from '../actions/project'
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
    downloadLines: index => dispatch(downloadLines(index)),
    downloadStops: index => dispatch(downloadStops(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle)
