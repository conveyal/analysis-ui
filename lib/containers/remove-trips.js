import {connect} from 'react-redux'

import RemoveTrips from 'lib/components/modification/remove-trips'
import * as select from 'lib/selectors'

function mapStateToProps(state, ownProps) {
  return {
    feeds: select.feedsWithBundleNames(state, ownProps),
    routePatterns: select.routePatterns(state, ownProps),
    selectedFeed: select.modificationFeed(state, ownProps)
  }
}

export default connect(mapStateToProps)(RemoveTrips)
