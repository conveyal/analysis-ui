//
import {connect} from 'react-redux'

import RemoveStops from '../components/modification/remove-stops'
import * as select from '../selectors'

function mapStateToProps(state, ownProps) {
  return {
    feeds: select.feedsWithBundleNames(state, ownProps),
    routePatterns: select.routePatterns(state, ownProps),
    routeStops: select.routeStops(state, ownProps),
    selectedFeed: select.modificationFeed(state, ownProps),
    selectedStops: select.selectedStops(state, ownProps)
  }
}

export default connect(mapStateToProps)(RemoveStops)
