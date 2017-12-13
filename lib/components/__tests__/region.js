// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import Region from '../region'

describe('Component > Region', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Region
          description='A test region'
          id='1234'
          isLoaded={false}
          name='Test'
        >
          Region content
        </Region>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
