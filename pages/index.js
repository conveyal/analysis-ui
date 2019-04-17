import {connect} from 'react-redux'

import {
  clearCurrentRegion,
  loadAll as loadAllRegions
} from '../lib/actions/region'
import SelectRegion from '../lib/components/select-region'
import selectRegions from '../lib/selectors/regions'

function mapStateToProps(state, ownProps) {
  return {
    regions: selectRegions(state, ownProps)
  }
}

export default connect(
  mapStateToProps,
  {
    clearCurrentRegion,
    loadAllRegions
  }
)(SelectRegion)
