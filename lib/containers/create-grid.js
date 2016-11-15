/** Upload a grid file to Scenario Editor */

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
    finish: projectId => dispatch([load(projectId), goBack()])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGrid)
