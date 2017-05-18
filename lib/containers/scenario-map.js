// @flow
import {connect} from 'react-redux'

import {setMapState} from '../actions/map'
import {setAndRetrieveData as replaceModification} from '../actions/modifications'
import ScenarioMap from '../components/scenario-map'

function mapStateToProps (state, props) {
  const {currentBundle, currentScenario, feeds} = state.scenario
  return {
    bundleId: currentBundle && currentBundle.id,
    centerLonLat: currentBundle ? {lon: currentBundle.centerLon, lat: currentBundle.centerLat} : null,
    feeds,
    feedsById: state.scenario.feedsById,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    modificationsById: state.scenario.modificationsById,
    scenarioIsReady: !!(currentBundle && currentScenario && feeds && feeds.length > 0)
  }
}

const mapDispatchToProps = {replaceModification, setMapState}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMap)
