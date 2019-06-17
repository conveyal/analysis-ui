import omit from 'lodash/omit'
import Router from 'next/router'
import {connect} from 'react-redux'

import {
  copy,
  deleteModification,
  saveToServer,
  setLocally,
  updateModification
} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import {RouteTo} from '../constants'
import * as select from '../selectors'

function mapStateToProps(state, ownProps) {
  return {
    allVariants: select.variants(state, ownProps),
    feed: select.modificationFeed(state, ownProps),
    feedIsLoaded: select.modificationFeedIsLoaded(state, ownProps),
    modification: select.activeModification(state, ownProps),
    saveInProgress: select.modificationSaveInProgress(state, ownProps)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    copyModification: m => dispatch(copy(m._id)),
    removeModification: m =>
      dispatch(deleteModification(m._id)).then(() => {
        Router.push({
          pathname: RouteTo.modifications,
          query: omit(Router.query, ['modificationId'])
        })
      }),

    update: modification => dispatch(saveToServer(modification)),
    updateAndRetrieveFeedData: m => dispatch(updateModification(m)),
    updateLocally: modification => dispatch(setLocally(modification))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModificationEditor)
