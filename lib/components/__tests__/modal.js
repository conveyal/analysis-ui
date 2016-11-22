/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Modal from '../modal'

describe('Component > Modal', () => {
  it('renders correctly', () => {
    const onRequestCloseFn = jest.fn()
    const tree = mount(
      <Modal onRequestClose={onRequestCloseFn}>
        Modal content
      </Modal>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(onRequestCloseFn).not.toBeCalled()
  })
})
