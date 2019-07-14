import {connect} from 'react-redux'

import {create} from '../actions/region'
import CreateRegion from '../components/create-region'

export default connect(
  null,
  {create}
)(CreateRegion)
