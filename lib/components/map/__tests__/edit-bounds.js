import {shallow} from 'enzyme'
import Leaflet from 'leaflet'
import React from 'react'

import {mockRegion} from 'lib/utils/mock-data'

import {EditBounds} from '../edit-bounds'

jest.mock('leaflet')

describe('Components > Map > Edit Bounds', () => {
  it('renders correctly', () => {
    const tree = shallow(
      <EditBounds
        bounds={mockRegion.bounds}
        leaflet={{
          map: new Leaflet.Map()
        }}
        save={jest.fn()}
      />
    )
    expect(tree).toMatchSnapshot()
  })
})
