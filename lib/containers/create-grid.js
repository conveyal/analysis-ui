/** Upload a grid file to Scenario Editor */

import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'
import CreateGrid from '../components/create-grid'
import {load} from '../actions/project'

function mapStateToProps (state, { params }) {
  return {
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetch: (opts) => dispatch(fetch(opts)),
    finish: projectId => dispatch([load(projectId), goBack()])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGrid)
