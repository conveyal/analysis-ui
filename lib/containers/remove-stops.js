// @flow
import {connect} from 'react-redux'

import RemoveStops from '../components/modification/remove-stops'
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
    feeds: state.scenario.feeds,
    routePatterns: selectRoutePatterns(state, ownProps),
    routeStops: selectRouteStops(state, ownProps),
    selectedFeed: selectModificationFeed(state, ownProps),
    selectedStops: selectSelectedStops(state, ownProps)
  }
}

export default connect(mapStateToProps)(RemoveStops)
