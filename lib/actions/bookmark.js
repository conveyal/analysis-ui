import omit from 'lodash/omit'
import {createAction} from 'redux-actions'

import {API} from 'lib/constants'

import fetch from './fetch'

// Properties stored locally but not in a profile request on the backend
const omitIllegalBookmarkProps = pr =>
  omit(pr, ['comparisonProjectId', 'comparisonVariant'])
const createBookmarkLocally = createAction('create bookmark')
const setBookmarks = createAction('set bookmarks')

export const createBookmark = bookmark =>
  fetch({
    url: `${API.Region}/${bookmark.regionId}/bookmarks`,
    options: {
      body: {
        ...bookmark,
        profileRequest: omitIllegalBookmarkProps(bookmark.profileRequest)
      },
      method: 'post'
    },
    next: response => createBookmarkLocally(response.value)
  })

export const loadBookmarks = regionId =>
  fetch({
    url: `${API.Region}/${regionId}/bookmarks`,
    next: res => setBookmarks(res.value)
  })

// Select a bookmark and update the profile request options
export const selectBookmark = createAction('select bookmark')
