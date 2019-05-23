import enzyme from 'enzyme'
import React from 'react'

import {mockRegion} from 'lib/utils/mock-data'

import Map from '../map'

const createProps = () => ({
  analysisBounds: mockRegion.bounds,
  disableMarker: false,
  displayedDataIsCurrent: true,
  markerPosition: [-78, 40],
  removeDestination: jest.fn(),
  setBounds: jest.fn(),
  setDestination: jest.fn(),
  setOrigin: jest.fn(),
  showBoundsEditor: false
})

const markerName = 'ForwardRef(Leaflet(Marker))'

describe('Components > Analysis > Map', () => {
  it('should render with default props correctly', async () => {
    const map = enzyme.shallow(<Map {...createProps()} />)
    expect(map).toMatchSnapshot()
    expect(map.find(markerName).props().draggable).toBe(true)
  })

  it('should disable marker correctly', async () => {
    const map = enzyme.shallow(<Map {...createProps()} disableMarker />)
    expect(map.find(markerName).props().draggable).toBe(false)
  })
})
