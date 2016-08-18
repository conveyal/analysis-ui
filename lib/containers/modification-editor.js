import {connect} from 'react-redux'

import {setActiveTrips, setMapState} from '../actions'
import {deleteModification, setAndRetrieveData} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'

function mapStateToProps ({
  mapState,
  scenario
}, {
  modification
}) {
  return {
    allVariants: scenario.variants,
    bundleId: scenario.currentScenario.bundleId,
    modification: modification,
    name: modification.name,
    type: modification.type,
    variants: modification.variants,

    // For sub-components
    feeds: scenario.feeds,
    feedsById: scenario.feedsById,
    mapState
  }
}

function mapDispatchToProps (dispatch, {
  modification
}) {
  return {
    remove: () => dispatch(deleteModification(modification.id)),
    replace: (opts) => dispatch(setAndRetrieveData(opts)),

    // for sub-components
    setActiveTrips: (opts) => dispatch(setActiveTrips(opts)),
    setMapState: (opts) => dispatch(setMapState(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
