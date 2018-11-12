// @flow
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import selectCurrentRegion from './current-region'

import type {Bookmark} from '../types'

export default createSelector(
  selectCurrentRegion,
  (region) => {
    const bookmarks: Bookmark[] = get(region, 'bookmarks', [])
    return sortBy(bookmarks, ['name'])
  }
)
