/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import Modal from '../modal'

describe('Component > Modal', () => {
  it('renders correctly', () => {
    const onRequestCloseFn = jest.fn()
    renderer.create(
      <Modal onRequestClose={onRequestCloseFn}>Modal content</Modal>
    )
    expect(onRequestCloseFn).not.toBeCalled()
  })
})
