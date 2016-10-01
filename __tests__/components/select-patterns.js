/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/input', () => { return mockComponents(['Group']) })

import SelectPatterns from '../../lib/components/select-patterns'

describe('SelectPatterns', () => {
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
