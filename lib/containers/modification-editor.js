import Router from 'next/router'
import {connect} from 'react-redux'

import {
  copy,
  deleteModification,
  saveToServer,
  setLocally,
  updateModification
} from 'lib/actions/modifications'
import ModificationEditor from 'lib/components/modification/editor'
import * as select from 'lib/selectors'
import {routeTo} from 'lib/router'

function mapStateToProps(state, ownProps) {
  return {
    allVariants: select.variants(state, ownProps),
    feeds: select.feedsWithBundleNames(state, ownProps),
    feed: select.modificationFeed(state, ownProps),
    feedIsLoaded: select.modificationFeedIsLoaded(state, ownProps),
    modification: select.activeModification(state, ownProps),
    saveInProgress: select.modificationSaveInProgress(state, ownProps)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    copyModification: (m) => dispatch(copy(m._id)),
    removeModification: (m) =>
      dispatch(deleteModification(m._id)).then(() => {
        const {projectId, regionId} = Router.query
        const {href, as} = routeTo('modifications', {projectId, regionId})
        Router.push(href, as)
      }),

    update: (modification) => dispatch(saveToServer(modification)),
    updateAndRetrieveFeedData: (m) => dispatch(updateModification(m)),
    updateLocally: (modification) => dispatch(setLocally(modification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
