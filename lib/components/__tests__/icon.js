/* global describe, it, expect */

describe('Component > Icon', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Icon = require('../icon')

  it('renders correctly', () => {
    const tree = renderer.create(
      <Icon
        type='pencil'
        className='test'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
