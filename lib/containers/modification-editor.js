// @flow
import {connect} from 'react-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {
  copy,
  deleteModification,
  set,
  setAndRetrieveData
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import selectModificationIsLoaded from '../selectors/modification-is-loaded'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, ownProps) {
  return {
    allVariants: selectVariants(state, ownProps),
    isLoaded: selectModificationIsLoaded(state, ownProps)
  }
}

function mapDispatchToProps (
  dispatch: Dispatch,
  {bundleId, modification, projectId}
) {
  return {
    copyModification: () => dispatch(copy({modification, projectId})),
    removeModification: () => dispatch(deleteModification(modification.id)),
    setModificationName: name => dispatch(set({...modification, name})),
    setModificationVariants: variants =>
      dispatch(set({...modification, variants})),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),
    update: properties =>
      dispatch(
        setAndRetrieveData({
          bundleId,
          modification: {...modification, ...properties}
        })
      ),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
