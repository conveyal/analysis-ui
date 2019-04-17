import {connect} from 'react-redux'

import {create} from '../lib/actions/region'
import CreateRegion from '../lib/components/create-region'

export default connect(
  null,
  {create}
)(CreateRegion)
