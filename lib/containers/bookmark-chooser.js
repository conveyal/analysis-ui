// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import {selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/region'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  return {
    bookmarks: select.bookmarks(state, ownProps),
    bookmarkData: select.bookmarkData(state, ownProps),
    selectedBookmark: get(state, 'analysis.selectedBookmark')
  }
}

const mapDispatchToProps = {
  createBookmark,
  selectBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
