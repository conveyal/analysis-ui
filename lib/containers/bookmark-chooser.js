// @flow
import {connect} from 'react-redux'

import {fetchTravelTimeSurface, selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/region'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import selectBookmarkData from '../selectors/bookmark-data'
import selectCurrentRegion from '../selectors/current-region'

function mapStateToProps (state, ownProps) {
  const {analysis} = state
  const region = selectCurrentRegion(state, ownProps) || {}
  return {
    bookmarks: region.bookmarks,
    bookmarkData: selectBookmarkData(state, ownProps),
    disabled: !!analysis.isFetchingIsochrone,
    selectedBookmark: analysis.selectedBookmark
  }
}

const mapDispatchToProps = {
  createBookmark,
  fetchTravelTimeSurface,
  selectBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
