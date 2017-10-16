import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {set as setModification} from '../actions/modifications'
import ImportShapefile from '../components/import-shapefile'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  return {
    variants: selectVariants(state, props),
    scenarioId: props.params.scenarioId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    close: () => dispatch(push(`/scenarios/${props.params.scenarioId}`)),
    setModification: modification => dispatch(setModification(modification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportShapefile)
