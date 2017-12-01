import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {loadAll as loadAllRegions} from '../actions/region'
import SelectRegion from '../components/select-region'
import selectRegions from '../selectors/regions'

function mapStateToProps (state, ownProps) {
  return {
    regions: selectRegions(state, ownProps)
  }
}

export default connect(mapStateToProps, {loadAllRegions, push})(SelectRegion)
