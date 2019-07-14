import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

export default function selectBookmarks(state) {
  const bookmarks = get(state, 'region.bookmarks', [])
  return sortBy(bookmarks, ['name'])
}
