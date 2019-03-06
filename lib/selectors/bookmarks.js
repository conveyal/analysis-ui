// @flow
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import type {Bookmark} from '../types'

import selectCurrentRegion from './current-region'

export default createSelector(
  selectCurrentRegion,
  (region) => {
    const bookmarks: Bookmark[] = get(region, 'bookmarks', [])
    return sortBy(bookmarks, ['name'])
  }
)
