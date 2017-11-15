// @flow
import {connect} from 'react-redux'

import {setMapState} from '../actions/map'
import {
  setAndRetrieveData as replaceModification
} from '../actions/modifications'
import ModificationsMap from '../components/modifications-map'
import selectActiveModification from '../selectors/active-modification'
import selectBundleCenter from '../selectors/bundle-center'
import selectBundleId from '../selectors/bundle-id'
import selectModificationFeed from '../selectors/modification-feed'
import selectModificationsOnMap from '../selectors/modifications-on-map'
import selectQualifiedStops from '../selectors/qualified-stops-from-segments'

function mapStateToProps (state, props) {
  const {feeds} = state.project
  return {
    activeModification: selectActiveModification(state, props),
    activeModificationFeed: selectModificationFeed(state, props),
    bundleId: selectBundleId(state, props),
    centerLonLat: selectBundleCenter(state, props),
    feeds,
    feedsById: state.project.feedsById,
    mapState: state.mapState,
    modificationsOnMap: selectModificationsOnMap(state, props),
    qualifiedStops: selectQualifiedStops(state, props)
  }
}

const mapDispatchToProps = {replaceModification, setMapState}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationsMap)
