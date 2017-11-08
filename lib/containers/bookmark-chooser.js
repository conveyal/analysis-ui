// @flow
import {connect} from 'react-redux'

import {fetchTravelTimeSurface, selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/project'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import selectBookmarkData from '../selectors/bookmark-data'
import selectCurrentProject from '../selectors/current-project'

function mapStateToProps (state, ownProps) {
  const {analysis} = state
  const project = selectCurrentProject(state, ownProps) || {}
  return {
    bookmarks: project.bookmarks,
    bookmarkData: selectBookmarkData(state, ownProps),
    disabled: analysis.isFetchingIsochrone || !analysis.isochroneLonLat,
    selectedBookmark: analysis.selectedBookmark
  }
}

const mapDispatchToProps = {
  createBookmark,
  fetchTravelTimeSurface,
  selectBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
