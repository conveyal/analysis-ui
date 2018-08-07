// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {copyFromProject} from '../actions/modifications'
import ImportModifications from '../components/import-modifications'
import * as select from '../selectors'
import get from '../utils/get'

function mapStateToProps (state, props) {
  const toProjectId = props.params.projectId
  return {
    projects: get(state, 'project.projects', []).filter(p => p._id !== toProjectId),
    toProjectId,
    variants: select.variants(state, props),
    regionId: props.params.regionId
  }
}

const mapDispatchToProps = {copyFromProject, push}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
