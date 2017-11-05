// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {
  copy,
  deleteModification,
  set,
  setActive,
  setAndRetrieveData
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import selectActiveModification from '../selectors/active-modification'
import selectBundleId from '../selectors/bundle-id'
import selectModificationFeedIsLoaded from '../selectors/modification-feed-is-loaded'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, ownProps) {
  return {
    allVariants: selectVariants(state, ownProps),
    feedIsLoaded: selectModificationFeedIsLoaded(state, ownProps),
    modification: selectActiveModification(state, ownProps),
    modificationId: ownProps.params.modificationId,
    scenarioId: ownProps.params.scenarioId
  }
}

const withModification = (fn) => (dispatch: Dispatch, getState) => {
  const state = getState()
  const modification = selectActiveModification(state)
  if (modification) dispatch(fn(modification))
}

const withBundle = (fn) => (dispatch: Dispatch, getState) => {
  const state = getState()
  const bundleId = selectBundleId(state)
  if (bundleId) dispatch(fn(bundleId))
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    clearActive: () => dispatch(setActive()),
    copyModification: () =>
      dispatch(withModification(modification => copy({modification}))),
    removeModification: () =>
      dispatch(withModification(modification => [
        deleteModification(modification._id),
        push(`/scenarios/${modification.scenarioId}`)
      ])),
    setActive: (modificationId) => dispatch(setActive(modificationId)),
    setModificationName: name =>
      dispatch(withModification(modification => set({...modification, name}))),
    setModificationVariants: variants =>
      dispatch(withModification(modification => set({...modification, variants}))),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),
    update: properties =>
      dispatch(withModification(modification => withBundle(bundleId =>
        setAndRetrieveData({
          bundleId,
          modification: {...modification, ...properties}
        })
      ))),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
