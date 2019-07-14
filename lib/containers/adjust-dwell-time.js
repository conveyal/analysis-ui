//
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import AdjustDwellTime from '../components/modification/adjust-dwell-time'
import * as select from '../selectors'

export default connect(
  createStructuredSelector({
    feeds: select.feedsWithBundleNames,
    routePatterns: select.routePatterns,
    routeStops: select.routeStops,
    selectedFeed: select.modificationFeed,
    selectedStops: select.selectedStops
  })
)(AdjustDwellTime)
