/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockFeed } from '../../../utils/mock-data'

import RemoveStops from '../remove-stops'

describe('Component > Modification > RemoveStops', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      feedsById: { '1': mockFeed },
      modification: {},
      setMapState: jest.fn(),
      update: jest.fn()
    }
    const tree = renderer.create(
      <RemoveStops
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'setMapState',
      'update'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
