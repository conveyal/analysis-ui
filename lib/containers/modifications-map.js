// @flow
import {connect} from 'react-redux'

import {setMapState} from '../actions/map'
import {
  setAndRetrieveData as replaceModification
} from '../actions/modifications'
import ModificationsMap from '../components/modifications-map'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const {feeds} = state.project
  return {
    activeModification: select.activeModification(state, props),
    activeModificationFeed: select.modificationFeed(state, props),
    bundleId: select.bundleId(state, props),
    centerLonLat: select.bundleCenter(state, props),
    feeds,
    feedsById: state.project.feedsById,
    mapState: state.mapState,
    modificationsOnMap: select.modificationsOnMap(state, props),
    qualifiedStops: select.qualifiedStopsFromSegments(state, props)
  }
}

const mapDispatchToProps = {replaceModification, setMapState}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationsMap)
