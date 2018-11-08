// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import {selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/region'
import BookmarkChooser from '../components/analysis/bookmark-chooser'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  const region = select.currentRegion(state, ownProps)
  return {
    bookmarks: get(region, 'bookmarks', []),
    bookmarkData: select.bookmarkData(state, ownProps),
    selectedBookmark: get(state, 'analysis.selectedBookmark')
  }
}

const mapDispatchToProps = {
  createBookmark,
  selectBookmark
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
