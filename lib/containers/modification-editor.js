import Router from 'next/router'
import {connect} from 'react-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {
  copy,
  deleteModification,
  saveToServer,
  setActive,
  setLocally,
  updateModification
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import {RouteTo} from '../constants'
import * as select from '../selectors'

function mapStateToProps(state, ownProps) {
  return {
    allVariants: select.variants(state, ownProps),
    feedIsLoaded: select.modificationFeedIsLoaded(state, ownProps),
    modification: select.activeModification(state, ownProps),
    modificationId: ownProps.query.modificationId,
    projectId: ownProps.query.projectId,
    regionId: ownProps.query.regionId,
    saveInProgress: select.modificationSaveInProgress(state, ownProps)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {modificationId, projectId, regionId} = ownProps.query
  return {
    clearActive: () => dispatch(setActive()),
    copyModification: () => dispatch(copy(modificationId)),
    removeModification: () =>
      dispatch(deleteModification(modificationId)).then(() => {
        Router.push({
          pathname: RouteTo.modifications,
          query: {projectId, regionId}
        })
      }),
    setActive: () => dispatch(setActive(modificationId)),

    // for sub-components
    setActiveTrips: opts => dispatch(setActiveTrips(opts)),

    // for sub-components
    setMapState: opts => dispatch(setMapState(opts)),

    update: modification => dispatch(saveToServer(modification)),
    updateAndRetrieveFeedData: m => dispatch(updateModification(m)),
    updateLocally: modification => dispatch(setLocally(modification))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModificationEditor)
