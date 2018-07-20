// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {create} from '../actions/project'
import CreateProject from '../components/create-project'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    bundles: select.bundlesReady(state, props),
    regionId: select.currentRegionId(state, props)
  }
}

const mapDispatchToProps = {
  create,
  goToCreateBundle: (regionId) =>
    push(`/regions/${regionId}/bundles/create`)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)
