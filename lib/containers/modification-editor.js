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
  setAndRetrieveData,
  setLocally
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import selectActiveModification from '../selectors/active-modification'
import selectModificationFeedIsLoaded from '../selectors/modification-feed-is-loaded'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, ownProps) {
  return {
    allVariants: selectVariants(state, ownProps),
    feedIsLoaded: selectModificationFeedIsLoaded(state, ownProps),
    modification: selectActiveModification(state, ownProps),
    modificationId: ownProps.params.modificationId,
    projectId: ownProps.params.projectId
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    clearActive: () => dispatch(setActive()),
    copyModification: () =>
      dispatch(copy(ownProps.params.modificationId)),
    removeModification: () =>
      dispatch([
        deleteModification(ownProps.params.modificationId),
        push(`/projects/${ownProps.params.projectId}`)
      ]),
    setActive: () => dispatch(setActive(ownProps.params.modificationId)),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts)),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),

    update: modification => dispatch(set(modification)),
    updateAndRetrieveFeedData: modification =>
      dispatch(setAndRetrieveData(modification)),
    updateLocally: modification => dispatch(setLocally(modification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
