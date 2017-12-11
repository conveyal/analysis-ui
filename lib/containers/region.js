// @flow
import {connect} from 'react-redux'

import {load} from '../actions/region'
import Region from '../components/region'

import selectCurrentRegion from '../selectors/current-region'

function mapStateToProps (state, props) {
  return {
    region: selectCurrentRegion(state, props)
  }
}

export default connect(mapStateToProps, {load})(Region)
