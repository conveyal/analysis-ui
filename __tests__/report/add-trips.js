/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { mockModification } from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import AddTrips from '../../lib/report/add-trips'

mockModification.segments.push({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [
        -122.0246,
        36.9707
      ],
      [
        -122.0279,
        37.049
      ],
      [
        -121.9799,
        37.2299
      ],
      [
        -121.9445,
        37.324
      ],
      [
        -121.936,
        37.353
      ],
      [
        -121.924,
        37.365
      ]
    ]
  }
})

describe('Report > AddTrips', () => {
  it('renders correctly', () => {
    const props = {
      modification: mockModification
    }

    // mount component
    const tree = mount(
      <AddTrips
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree.find('.table'))).toMatchSnapshot()
    expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
    expect(Leaflet.circleMarker.mock.calls[0][0]).toMatchSnapshot()
  })
})
