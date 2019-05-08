//
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import selectCurrentRegion from './current-region'

export default createSelector(
  selectCurrentRegion,
  region => {
    const bookmarks = get(region, 'bookmarks', [])
    return sortBy(bookmarks, ['name'])
  }
)
