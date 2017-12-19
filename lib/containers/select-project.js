// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import SelectProject from '../components/select-project'
import get from '../utils/get'

function mapStateToProps (state, ownProps) {
  return {
    regionId: get(ownProps, 'params.regionId'),
    projects: get(state, 'project.projects', [])
  }
}

export default connect(mapStateToProps, {push})(SelectProject)
