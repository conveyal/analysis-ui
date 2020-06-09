import {Box, Button, FormControl, FormLabel} from '@chakra-ui/core'
import get from 'lodash/get'
import {useDispatch, useSelector} from 'react-redux'

import {
  setMaxTripDurationMinutes,
  setTravelTimePercentile
} from 'lib/actions/analysis'
import {createBookmark} from 'lib/actions/bookmark'
import message from 'lib/message'
import selectBookmarks from 'lib/selectors/bookmarks'

import Select from '../select'

export default function BookmarkChooser({
  disabled,
  isComparison = false,
  onChange,
  requestSettings,
  ...p
}) {
  const dispatch = useDispatch()
  const bookmarks = useSelector(selectBookmarks)
  const id = 'select-bookmark-' + isComparison

  function _selectBookmark(e) {
    const bookmark = bookmarks.find((b) => b._id === e._id)
    if (bookmark) {
      const settings = bookmark.profileRequest
      onChange(settings)
      dispatch(setMaxTripDurationMinutes(settings.maxTripDurationMinutes))

      if (settings.travelTimePercentile) {
        dispatch(setTravelTimePercentile(settings.travelTimePercentile))
      }
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
          ...requestSettings,
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
        htmlFor={id}
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
          name={id}
          inputId={id}
          isDisabled={disabled}
          getOptionLabel={(b) => get(b, 'name')}
          getOptionValue={(b) => get(b, '_id')}
          options={bookmarks}
          onChange={_selectBookmark}
        />
      </Box>
    </FormControl>
  )
}
