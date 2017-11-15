import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import SelectProject from '../components/select-project'

function mapStateToProps ({project}, {params}) {
  return {
    regionId: params.regionId,
    projects: project.projects
  }
}

export default connect(mapStateToProps, {push})(SelectProject)
