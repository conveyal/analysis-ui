/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../test-utils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/input', () => { return mockComponents(['Group']) })

import SelectFeedAndRoutes from '../../lib/components/select-feed-and-routes'

describe('Component > SelectFeedAndRoutes', () => {
  it('renders correctly', () => {
    const feeds = [{ id: 1 }, { id: 2 }]
    const onChangeFn = jest.fn()
    const tree = renderer.create(
      <SelectFeedAndRoutes
        feeds={feeds}
        onChange={onChangeFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
