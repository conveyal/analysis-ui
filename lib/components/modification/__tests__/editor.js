/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockFeed, mockMapState, mockModification } from '../../../utils/mock-data'

import ModificationEditor from '../editor'

describe('Component > Modification > ModificationEditor', () => {
  it('renders correctly', () => {
    const props = {
      allVariants: [],
      bundleId: '1',
      modification: mockModification,
      name: 'Test Modification',
      remove: jest.fn(),
      replace: jest.fn(),
      type: 'add-trip-pattern',
      variants: [],
      feeds: [mockFeed],
      feedsById: { '1': mockFeed },
      mapState: mockMapState,
      setActiveTrips: jest.fn(),
      setMapState: jest.fn()
    }
    const tree = renderer.create(
      <ModificationEditor
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'remove',
      'replace',
      'setActiveTrips',
      'setMapState'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
