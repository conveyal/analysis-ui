/* global describe, it, expect, jest */

describe('Component > Project', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Project = require('../project')

  it('renders correctly', () => {
    const addComponentToMapFn = jest.fn()
    const loadFn = jest.fn()
    const tree = renderer
      .create(
        <Project
          addComponentToMap={addComponentToMapFn}
          id='1234'
          isLoaded={false}
          load={loadFn}
          name='Test'
          regionId='Test1234'
        >
          Project content
        </Project>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(addComponentToMapFn).not.toBeCalled()
    expect(loadFn).toBeCalled()
  })
})
