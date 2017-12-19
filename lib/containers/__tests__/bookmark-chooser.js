// @flow
import React from 'react'

import BookmarkChooser from '../bookmark-chooser'
import {mockWithProvider} from '../../utils/mock-data'

describe('Containers > Bookmark Chooser', function () {
  it('should render correctly', function () {
    const {snapshot} = mockWithProvider(<BookmarkChooser />)
    expect(snapshot()).toMatchSnapshot()
  })
})
