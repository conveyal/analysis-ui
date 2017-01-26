/* global describe, it, expect, jest */

describe('Component > Project', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Project = require('../project')

  it('renders correctly', () => {
    const loadFn = jest.fn()
    const tree = renderer.create(
      <Project
        description='A test project'
        id='1234'
        isLoaded={false}
        load={loadFn}
        name='Test'
        >
        Project content
      </Project>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(loadFn).toBeCalled()
  })
})
