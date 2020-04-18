import {connect} from 'react-redux'

// defaults to region bounds
import selectProfileRequest from 'lib/selectors/profile-request'

import EditBounds from '../components/map/edit-bounds'
import {setProfileRequest} from '../actions/analysis/profile-request'

function mapStateToProps(state, props) {
  return {
    bounds: selectProfileRequest(state, props).bounds
  }
}

function mapDispatchToProps(dispatch) {
  return {
    save: (bounds) => dispatch(setProfileRequest({bounds}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBounds)
