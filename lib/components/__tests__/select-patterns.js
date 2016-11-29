/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import SelectPatterns from '../select-patterns'

describe('Component > SelectPatterns', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const routePatterns = [
      {
        pattern_id: 1,
        name: 'mock pattern',
        trips: []
      }
    ]
    const tree = renderer.create(
      <SelectPatterns
        onChange={onChangeFn}
        routePatterns={routePatterns}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
