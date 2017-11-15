/* global describe, it, expect, jest */

describe('Component > SelectScenario', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const SelectScenario = require('../select-scenario')

  it('renders correctly', () => {
    const mockScenarios = [{_id: 1, name: 'S1'}, {_id: 2, name: 'S2'}]
    const pushFn = jest.fn()
    const tree = renderer
      .create(
        <SelectScenario
          regionId='P1'
          push={pushFn}
          scenarios={mockScenarios}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})
