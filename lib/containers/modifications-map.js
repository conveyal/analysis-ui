import get from 'lodash/get'
import {connect} from 'react-redux'

import ModificationsMap from '../components/modifications-map'
import * as select from '../selectors'

function mapStateToProps(state, props) {
  const modifications = select.modifications(state, props)
  return {
    activeModificationFeed: select.modificationFeed(state, props),
    bundleId: select.bundleId(state, props),
    feeds: get(state, 'project.feeds', []),
    allStops: select.stopsFromAllFeeds(state, props),
    feedsById: select.feedsById(state, props),
    mapState: get(state, 'mapState', {}),
    modifications: modifications.filter(m =>
      props.modificationsOnMap.includes(m._id)
    ),
    qualifiedStops: select.qualifiedStopsFromSegments(state, props)
  }
}

export default connect(mapStateToProps)(ModificationsMap)
