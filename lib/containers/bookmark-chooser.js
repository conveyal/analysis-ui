import get from 'lodash/get'
import {connect} from 'react-redux'

import {selectBookmark} from 'lib/actions/analysis'
import {createBookmark} from 'lib/actions/region'
import BookmarkChooser from 'lib/components/analysis/bookmark-chooser'
import selectBookmarks from 'lib/selectors/bookmarks'
import selectBookmarkData from 'lib/selectors/bookmark-data'

function mapStateToProps(state, ownProps) {
  return {
    bookmarks: selectBookmarks(state, ownProps),
    bookmarkData: selectBookmarkData(state, ownProps),
    selectedBookmark: get(state, 'analysis.selectedBookmark')
  }
}

const mapDispatchToProps = {
  createBookmark,
  selectBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
