// @flow
import toJson from 'enzyme-to-json'
import React from 'react'

import Map from '../map'

import * as mock from '../../../utils/mock-data'
import {toLatLngBounds} from '../../../utils/bounds'

const createProps = () => ({
  analysisBounds: toLatLngBounds(mock.mockRegion.bounds),
  disableMarker: false,
  displayedDataIsCurrent: true,
  markerPosition: [-78, 40],
  removeDestination: jest.fn(),
  setBounds: jest.fn(),
  setDestination: jest.fn(),
  setOrigin: jest.fn(),
  showBoundsEditor: false
})

const mountAndFindMap = p => {
  const {wrapper} = mock.mockWithProvider(<Map {...p} />, {})
  return wrapper.find('AnalysisMap')
}

describe('Components > Analysis > Map', () => {
  it('should render with default props correctly', () => {
    const map = mountAndFindMap(createProps())
    expect(toJson(map)).toMatchSnapshot()
    expect(map.find('Marker').props().draggable).toBe(true)
  })

  it('should disable marker correctly', () => {
    const map = mountAndFindMap({...createProps(), disableMarker: true})
    expect(map.find('Marker').props().draggable).toBe(false)
  })
})
