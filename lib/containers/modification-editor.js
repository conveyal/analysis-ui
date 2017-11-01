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
import selectActiveModification from '../selectors/active-modification'
import selectModificationFeedIsLoaded from '../selectors/modification-feed-is-loaded'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, ownProps) {
  return {
    allVariants: selectVariants(state, ownProps),
    feedIsLoaded: selectModificationFeedIsLoaded(state, ownProps),
    modification: selectActiveModification(state, ownProps)
  }
}

const withModification = (fn) => (dispatch: Dispatch, getState) => {
  const state = getState()
  const modification = selectActiveModification(state)
  if (modification) dispatch(fn(modification))
}

function mapDispatchToProps (
  dispatch: Dispatch,
  {bundleId, projectId}
) {
  return {
    copyModification: () =>
      dispatch(withModification(modification => copy({modification, projectId}))),
    removeModification: () =>
      dispatch(withModification(modification => deleteModification(modification.id))),
    setModificationName: name =>
      dispatch(withModification(modification => set({...modification, name}))),
    setModificationVariants: variants =>
      dispatch(withModification(modification => set({...modification, variants}))),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),
    update: properties =>
      dispatch(withModification(modification =>
        setAndRetrieveData({
          bundleId,
          modification: {...modification, ...properties}
        })
      )),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
