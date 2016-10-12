/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import Leaflet from '../../../test-utils/mock-leaflet'
import React from 'react'
import { Map } from 'react-leaflet'

import EditProjectBounds from '../../../lib/components/map/edit-project-bounds'

describe('Components > Map > EditProjectBounds', () => {
  it('renders correctly', () => {
    const props = {
      bounds: {
        north: 12,
        east: -34,
        south: -34,
        west: 12
      },
      isLoaded: true,
      saveLocally: jest.fn()
    }

    const tree = mount(
      <Map>
        <EditProjectBounds
          {...props}
          />
      </Map>
    , {
      attachTo: document.getElementById('test')
    })
    expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
    expect(Leaflet.marker.mock.calls[1][0]).toMatchSnapshot()
    expect(Leaflet.rectangle.mock.calls[0][0]).toMatchSnapshot()
    const mountedMap = tree.find(Map)
    expect(mountedMap.node.leafletElement.getBounds()).toMatchSnapshot()
  })
})
