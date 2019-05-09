import {connect} from 'react-redux'

import {setCenter} from 'lib/actions/map'
import {deleteRegion, load, save, setLocally} from 'lib/actions/region'
import EditRegion from 'lib/components/edit-region'
import selectCurrentRegion from 'lib/selectors/current-region'

function mapState(state, ownProps) {
  return {
    region: selectCurrentRegion(state, ownProps)
  }
}

const mapDispatchToProps = {
  deleteRegion,
  save,
  setCenter,
  setLocally,
  load
}

export default connect(
  mapState,
  mapDispatchToProps
)(EditRegion)
