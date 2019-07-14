//
import React from 'react'

import BookmarkChooser from '../bookmark-chooser'
import {mockWithProvider} from '../../utils/mock-data'

describe('Containers > Bookmark Chooser', function() {
  it('should render correctly', function() {
    const {wrapper} = mockWithProvider(<BookmarkChooser />)
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })
})
