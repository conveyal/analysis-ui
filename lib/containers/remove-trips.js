// @flow
import {connect} from 'react-redux'

import RemoveTrips from '../components/modification/remove-trips'
import selectFeedsWithBundleNames from '../selectors/feeds-with-bundle-names'
import selectModificationFeed from '../selectors/modification-feed'
import selectRoutePatterns from '../selectors/route-patterns'

import type {Modification} from '../types'

function mapStateToProps (
  state: any,
  ownProps: {modification: Modification}
): any {
  return {
    feeds: selectFeedsWithBundleNames(state, ownProps),
    routePatterns: selectRoutePatterns(state, ownProps),
    selectedFeed: selectModificationFeed(state, ownProps)
  }
}

export default connect(mapStateToProps)(RemoveTrips)
