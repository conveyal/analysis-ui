// @flow
import {connect} from 'react-redux'

import {create} from '../actions/region'
import CreateRegion from '../components/create-region'

function mapDispatchToProps (dispatch: Dispatch, {params}) {
  return {
    create: opts => dispatch(create(opts))
  }
}

export default connect(null, mapDispatchToProps)(CreateRegion)
