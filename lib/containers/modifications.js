// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {
  create as createModification,
  saveToServer as updateModification
} from '../actions/modifications'
import Modifications from '../components/modification/list'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    bundleId: select.bundleId(state, props),
    modifications: state.project.modifications || [],
    modificationsByType: select.modificationsByType(state, props),
    regionId: select.currentRegionId(state, props),
    project: select.currentProject(state, props),
    projectId: select.currentProjectId(state, props),
    variants: select.variants(state, props)
  }
}

export default connect(mapStateToProps, {
  createModification,
  push,
  updateModification
})(Modifications)
