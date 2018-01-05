// @flow
import {connect} from 'react-redux'

import {fetchTravelTimeSurface, selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/region'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  const {analysis} = state
  const region = select.currentRegion(state, ownProps) || {}
  return {
    bookmarks: region.bookmarks,
    bookmarkData: select.bookmarkData(state, ownProps),
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
