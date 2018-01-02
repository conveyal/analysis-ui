// @flow
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import AdjustSpeed from '../components/modification/adjust-speed'
import * as select from '../selectors'

export default connect(createStructuredSelector({
  feeds: select.feedsWithBundleNames,
  routePatterns: select.routePatterns,
  selectedFeed: select.modificationFeed
}))(AdjustSpeed)
