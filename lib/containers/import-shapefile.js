// @flow
import {connect} from 'react-redux'

import {createMultiple} from '../actions/modifications'
import ImportShapefile from '../components/import-shapefile'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    variants: select.variants(state, props),
    projectId: select.currentProjectId(state, props)
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    createModifications: modifications => dispatch(createMultiple(modifications))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportShapefile)
