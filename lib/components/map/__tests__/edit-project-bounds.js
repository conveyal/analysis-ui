// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import EditProjectBounds from '../edit-project-bounds'
import {mockProject} from '../../../utils/mock-data'

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
      project: mockProject,
      setLocally: jest.fn()
    }

    const tree = renderer.create(
      <Map>
        <EditProjectBounds {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
