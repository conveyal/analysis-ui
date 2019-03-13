// @flow
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'
import Leaflet from 'leaflet'
import React from 'react'

import {EditBounds} from '../edit-bounds'

jest.mock('leaflet')

describe('Components > Map > Edit Bounds', () => {
  it('renders correctly', () => {
    const tree = shallow(
      <EditBounds
        bounds={new Leaflet.LatLngBounds([40, -71], [41, -72])}
        leaflet={{
          map: new Leaflet.Map()
        }}
        save={jest.fn()}
      />
    )
    expect(toJSON(tree)).toMatchSnapshot()
  })
})
