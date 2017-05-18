// @flow
import {connect} from 'react-redux'

import Reroute from '../components/modification/reroute'
import selectModificationFeed from '../selectors/modification-feed'
import selectSegmentDistances from '../selectors/segment-distances'
import selectStopsFromModification from '../selectors/stops-from-modification'
import selectRoutePatterns from '../selectors/route-patterns'

import type {Modification} from '../types'

function mapStateToProps (state: any, ownProps: {modification: Modification}): any {
  return {
    feeds: state.scenario.feeds,
    mapState: state.mapState,
    routePatterns: selectRoutePatterns(state, ownProps),
    segmentDistances: selectSegmentDistances(state, ownProps),
    selectedFeed: selectModificationFeed(state, ownProps),
    stops: selectStopsFromModification(state, ownProps)
  }
}

export default connect(mapStateToProps)(Reroute)
