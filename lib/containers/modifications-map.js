// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import ModificationsMap from '../components/modifications-map'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    activeModificationFeed: select.modificationFeed(state, props),
    bundleId: select.bundleId(state, props),
    feeds: get(state, 'project.feeds', []),
    feedsById: get(state, 'project.feedsById', {}),
    mapState: get(state, 'mapState', {}),
    modificationsOnMap: select.modificationsOnMap(state, props),
    qualifiedStops: select.qualifiedStopsFromSegments(state, props)
  }
}

export default connect(mapStateToProps)(ModificationsMap)
