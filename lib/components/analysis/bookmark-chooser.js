import {faPlus} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import Select from '../select'
import Icon from '../icon'
import {Group} from '../input'
import {Button} from '../buttons'

export default function BookmarkChooser(p) {
  function selectBookmark(e) {
    const bookmark = p.bookmarks.find(b => b._id === e.value)
    if (bookmark) p.selectBookmark(bookmark)
  }

  function createBookmark() {
    const bookmarkName = window.prompt(
      'Enter a name for your bookmark',
      `Bookmark ${p.bookmarks.length + 1}`
    )

    if (bookmarkName && bookmarkName.length > 0) {
      p.createBookmark({
        ...p.bookmarkData,
        name: bookmarkName
      })
    }
  }

  const options = p.bookmarks.map(b => ({
    label: b.name,
    value: b._id
  }))

  return (
    <Group label={message('analysis.bookmark')}>
      <div className='row'>
        <div className='col-xs-6'>
          <Select
            clearable={false}
            options={options}
            disabled={p.disabled} // don't allow users to reselect bookmarks while their bookmark is loading
            value={p.selectedBookmark}
            onChange={selectBookmark}
          />
        </div>
        <div className='col-xs-6'>
          <Button
            block
            disabled={p.disabled}
            onClick={createBookmark}
            style='success'
          >
            <Icon icon={faPlus} /> {message('analysis.createBookmark')}
          </Button>
        </div>
      </div>
    </Group>
  )
}
