// @flow
import {mount} from 'enzyme'
import React from 'react'

import Modal from '../modal'

describe('Component > Modal', () => {
  it('renders correctly', () => {
    const onRequestCloseFn = jest.fn()
    mount(<Modal onRequestClose={onRequestCloseFn}>Modal content</Modal>)
    expect(onRequestCloseFn).not.toHaveBeenCalled()
  })
})
