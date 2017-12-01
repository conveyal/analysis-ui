/* global describe, it, expect, jest */

describe('Component > Region', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Region = require('../region')

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Region
          description='A test region'
          id='1234'
          isLoaded={false}
          name='Test'
        >
          Region content
        </Region>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
