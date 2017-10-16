// @flow
import {connect} from 'react-redux'

import {fetchTravelTimeSurface, selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/project'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import selectBookmarkData from '../selectors/bookmark-data'

function mapStateToProps (state, ownProps) {
  const {project, analysis} = state
  return {
    bookmarks: project.currentProject.bookmarks,
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
