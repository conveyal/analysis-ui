import {connect} from 'react-redux'

import SelectRegion from '../components/select-region'
import selectRegions from '../selectors/regions'

function mapStateToProps(state, ownProps) {
  return {
    regions: selectRegions(state, ownProps)
  }
}

export default connect(mapStateToProps)(SelectRegion)
