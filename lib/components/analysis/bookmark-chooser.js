import {Box, Button, FormControl, FormLabel} from '@chakra-ui/core'
import get from 'lodash/get'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {createBookmark, selectBookmark} from 'lib/actions/bookmark'
import message from 'lib/message'
import selectBookmarks from 'lib/selectors/bookmarks'
import selectBookmarkData from 'lib/selectors/bookmark-data'

import Select from '../select'

export default function BookmarkChooser({disabled, onChange, ...p}) {
  const dispatch = useDispatch()
  const bookmarks = useSelector(selectBookmarks)
  const bookmarkData = useSelector(selectBookmarkData)
  const selectedBookmark = useSelector((s) =>
    get(s, 'analysis.selectedBookmark')
  )

  function _selectBookmark(e) {
    const bookmark = bookmarks.find((b) => b._id === e._id)
    if (bookmark) {
      dispatch(selectBookmark(bookmark))
      onChange(bookmark.profileRequest)
    }
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
    <FormControl isDisabled={disabled} {...p}>
      <FormLabel
        display='flex'
        justifyContent='space-between'
        htmlFor='select-bookmark'
        pr={0}
        pb='3px'
      >
        {message('analysis.bookmark')}
        <Button
          isDisabled={disabled}
          onClick={_createBookmark}
          rightIcon='small-add'
          size='xs'
          variantColor='green'
        >
          New
        </Button>
      </FormLabel>
      <Box>
        <Select
          name='select-bookmark'
          inputId='select-bookmark'
          isDisabled={disabled}
          getOptionLabel={(b) => b.name}
          getOptionValue={(b) => b._id}
          options={bookmarks}
          value={bookmarks.find((b) => b._id === selectedBookmark)}
          onChange={_selectBookmark}
        />
      </Box>
    </FormControl>
  )
}
