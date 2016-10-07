/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('react-modal', () => 'React-Modal')

import Modal from '../../lib/components/modal'

describe('Component > Modal', () => {
  it('renders correctly', () => {
    const onRequestCloseFn = jest.fn()
    const tree = renderer.create(
      <Modal onRequestClose={onRequestCloseFn}>
        Modal content
      </Modal>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onRequestCloseFn).not.toBeCalled()
  })
})
