// @flow
import enzyme from 'enzyme'
import React from 'react'

import DrawPolygon from '../draw-polygon'

describe('Project-Map > DrawPolygon', () => {
  it('works correctly', () => {
    expect(enzyme.shallow(<DrawPolygon onPolygon={jest.fn()} />)).toMatchSnapshot()
  })
})
