/* global describe, it, expect, jest */

describe('Component > Scenario', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const Scenario = require('../scenario')

  it('renders correctly', () => {
    const addComponentToMapFn = jest.fn()
    const loadFn = jest.fn()
    const tree = renderer.create(
      <Scenario
        addComponentToMap={addComponentToMapFn}
        id='1234'
        isLoaded={false}
        load={loadFn}
        name='Test'
        projectId='Test1234'
        >
        Scenario content
      </Scenario>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(addComponentToMapFn).not.toBeCalled()
    expect(loadFn).toBeCalled()
  })
})
