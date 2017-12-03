// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {set as setModification} from '../actions/modifications'
import ImportShapefile from '../components/import-shapefile'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  return {
    variants: selectVariants(state, props),
    projectId: props.params.projectId
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    close: () => dispatch(push(`/projects/${props.params.projectId}`)),
    setModification: modification => dispatch(setModification(modification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportShapefile)
