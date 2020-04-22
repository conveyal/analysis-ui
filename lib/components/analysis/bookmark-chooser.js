import {faPlus} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {createBookmark, selectBookmark} from 'lib/actions/bookmark'
import message from 'lib/message'
import selectBookmarks from 'lib/selectors/bookmarks'
import selectBookmarkData from 'lib/selectors/bookmark-data'

import Select from '../select'
import Icon from '../icon'
import {Group} from '../input'
import {Button} from '../buttons'

export default function BookmarkChooser(p) {
  const dispatch = useDispatch()
  const bookmarks = useSelector(selectBookmarks)
  const bookmarkData = useSelector(selectBookmarkData)
  const selectedBookmark = useSelector((s) =>
    get(s, 'analysis.selectedBookmark')
  )

  function _selectBookmark(e) {
    const bookmark = bookmarks.find((b) => b._id === e._id)
    if (bookmark) dispatch(selectBookmark(bookmark))
  }

  function _createBookmark() {
    const bookmarkName = window.prompt(
      'Enter a name for your bookmark',
      `Bookmark ${bookmarks.length + 1}`
    )

    if (bookmarkName && bookmarkName.length > 0) {
      dispatch(
        createBookmark({
          ...bookmarkData,
          name: bookmarkName
        })
      )
    }
  }

  return (
    <Group>
      <label className='control-label' htmlFor='select-bookmark'>
        {message('analysis.bookmark')}
      </label>
      <div className='row'>
        <div className='col-xs-6'>
          <Select
            name='select-bookmark'
            inputId='select-bookmark'
            isDisabled={p.disabled}
            getOptionLabel={(b) => b.name}
            getOptionValue={(b) => b._id}
            options={bookmarks}
            value={bookmarks.find((b) => b._id === selectedBookmark)}
            onChange={_selectBookmark}
          />
        </div>
        <div className='col-xs-6'>
          <Button
            block
            disabled={p.disabled}
            onClick={_createBookmark}
            style='success'
          >
            <Icon icon={faPlus} /> {message('analysis.createBookmark')}
          </Button>
        </div>
      </div>
    </Group>
  )
}
