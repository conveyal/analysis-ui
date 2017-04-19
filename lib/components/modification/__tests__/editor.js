/* global describe, it, expect, jest */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import renderer from 'react-test-renderer'
import React from 'react'

import {
  mockFeed,
  mockMapState,
  mockModification,
  mockPattern,
  mockStop
} from '../../../utils/mock-data'

import ModificationEditor from '../editor'

const createProps = () => ({
  allPhaseFromTimetableStops: {},
  allVariants: ['Default'],
  bundleId: '1',
  extendFromEnd: true,
  gtfsStops: [],
  isLoaded: true,
  lastStopDistanceFromStart: 0,
  modification: mockModification,
  name: 'Test Modification',
  remove: jest.fn(),
  replace: jest.fn(),
  type: 'add-trip-pattern',
  variants: [true],
  feeds: [mockFeed],
  mapState: mockMapState,
  numberOfStops: 0,
  routePatterns: [mockPattern],
  routeStops: [mockStop],
  scenarioTimetables: [],
  selectedStops: [mockStop],
  segmentDistances: [],
  setActiveTrips: jest.fn(),
  setMapState: jest.fn(),
  stops: []
})

describe('Component > Modification > ModificationEditor', () => {
  it('renders correctly', () => {
    const props = createProps()
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

  it('render just the title if not loaded', () => {
    const props = createProps()
    const props2 = {...props, isLoaded: false}
    const tree = renderer.create(
      <ModificationEditor
        {...props2}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls replace when the variant changes', () => {
    const props = createProps()
    const tree = mount(<ModificationEditor {...props} />)
    tree.find('input[title="Default"]').simulate('change', {target: {checked: false}})
    expect(props.replace).toBeCalled()
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
