// @flow
import {connect} from 'react-redux'

import AdjustDwellTime from '../components/modification/adjust-dwell-time'
import selectFeedsWithBundleNames from '../selectors/feeds-with-bundle-names'
import selectModificationFeed from '../selectors/modification-feed'
import selectRoutePatterns from '../selectors/route-patterns'
import selectRouteStops from '../selectors/route-stops'
import selectSelectedStops from '../selectors/selected-stops'

import type {Modification} from '../types'

function mapStateToProps (
  state: any,
  ownProps: {modification: Modification}
): any {
  return {
    feeds: selectFeedsWithBundleNames(state, ownProps),
    routePatterns: selectRoutePatterns(state, ownProps),
    routeStops: selectRouteStops(state, ownProps),
    selectedFeed: selectModificationFeed(state, ownProps),
    selectedStops: selectSelectedStops(state, ownProps)
  }
}

export default connect(mapStateToProps)(AdjustDwellTime)
