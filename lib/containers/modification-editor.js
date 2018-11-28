// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {
  copy,
  deleteModification,
  saveToServer,
  setActive,
  setLocally,
  update
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  return {
    allVariants: select.variants(state, ownProps),
    feedIsLoaded: select.modificationFeedIsLoaded(state, ownProps),
    modification: select.activeModification(state, ownProps),
    modificationId: ownProps.params.modificationId,
    projectId: ownProps.params.projectId,
    regionId: ownProps.params.regionId,
    saveInProgress: select.modificationSaveInProgress(state, ownProps)
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
        push(`/regions/${ownProps.params.regionId}/projects/${ownProps.params.projectId}`)
      ]),
    setActive: () => dispatch(setActive(ownProps.params.modificationId)),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts)),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),

    update: modification => dispatch(saveToServer(modification)),
    updateAndRetrieveFeedData: modification =>
      dispatch(update(modification)),
    updateLocally: modification => dispatch(setLocally(modification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
