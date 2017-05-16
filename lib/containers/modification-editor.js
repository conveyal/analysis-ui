// @flow
import {connect} from 'react-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {deleteModification, set, setAndRetrieveData} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import selectModificationIsLoaded from '../selectors/modification-is-loaded'

function mapStateToProps (state, ownProps) {
  const {scenario} = state
  return {
    allVariants: scenario.variants,
    isLoaded: selectModificationIsLoaded(state, ownProps)
  }
}

function mapDispatchToProps (dispatch: Dispatch, {
  bundleId,
  modification
}) {
  return {
    removeModification: () => dispatch(deleteModification(modification.id)),
    setModificationName: (name) => dispatch(set({...modification, name})),
    setModificationVariants: (variants) => dispatch(set({...modification, variants})),

    // for sub-components
    setMapState: (opts) => dispatch(setMapState(opts)),
    update: (properties) => dispatch(setAndRetrieveData({bundleId, modification: {...modification, ...properties}})),

    // for sub-components
    setActiveTrips: (opts) => dispatch(setActiveTrips(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
