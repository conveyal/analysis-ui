/* global describe, it, expect, jest */

describe('Component > Modal', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Modal = require('../modal')

  it('renders correctly', () => {
    const onRequestCloseFn = jest.fn()
    renderer.create(
      <Modal onRequestClose={onRequestCloseFn}>
        Modal content
      </Modal>
    )
    expect(onRequestCloseFn).not.toBeCalled()
  })
})
