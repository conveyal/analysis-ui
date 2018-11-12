// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import Pure from '@conveyal/woonerf/components/pure'
import React from 'react'
import Select from 'react-select'

import {Group} from '../input'
import {Button} from '../buttons'
import type {Bookmark} from '../../types'

type Props = {
  bookmarkData: any,
  bookmarks: Bookmark[],
  createBookmark: (any) => void,
  disabled: boolean,
  selectBookmark: (Bookmark) => void,
  selectedBookmark: boolean
}

export default class BookmarkChooser extends Pure {
  props: Props

  _selectBookmark = (e: {value: string}) => {
    const p = this.props

    const bookmark = p.bookmarks.find(b => b._id === e.value)
    if (bookmark) p.selectBookmark(bookmark)
  }

  _createBookmark = () => {
    const p = this.props
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

  render () {
    const p = this.props
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
              onChange={this._selectBookmark}
            />
          </div>
          <div className='col-xs-6'>
            <Button
              block
              disabled={p.disabled}
              onClick={this._createBookmark}
              style='success'
            >
              <Icon type='plus' /> {message('analysis.createBookmark')}
            </Button>
          </div>
        </div>
      </Group>
    )
  }
}
